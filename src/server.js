const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        versao: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Endpoint cidades por estado
app.get('/api/v1/cidades/:uf', async (req, res) => {

    const uf = req.params.uf.toUpperCase();
    const limite = parseInt(req.query.limite) || 10;

    // Validação UF
    if (uf.length !== 2) {
        return res.status(400).json({
            erro: true,
            codigo: 'SIGLA_UF_INVALIDA',
            mensagem: 'A sigla do estado deve conter exatamente 2 letras',
            sigla_uf_informada: req.params.uf
        });
    }

    try {

        const response = await axios.get(
            `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`
        );

        const cidades = response.data
            .slice(0, limite)
            .map(cidade => ({
                nome: cidade.nome
            }));

        res.status(200).json({
            uf: uf,
            quantidade_retornada: cidades.length,
            cidades: cidades,
            consultado_em: new Date().toISOString()
        });

    } catch (error) {

        res.status(404).json({
            erro: true,
            codigo: 'UF_NAO_ENCONTRADA',
            mensagem: 'Estado com a sigla informada não foi encontrado',
            sigla_uf_informada: uf
        });

    }

});app.get('/api/v1/clima/:nome_cidade', async (req, res) => {
    const nomeCidade = req.params.nome_cidade;

    if (!nomeCidade || nomeCidade.trim().length < 2) {
        return res.status(400).json({
            erro: true,
            codigo: 'NOME_INVALIDO',
            mensagem: 'O nome da cidade deve conter pelo menos 2 caracteres',
            nome_informado: nomeCidade
        });
    }

    try {
        const cidadeBusca = await axios.get(
            `https://brasilapi.com.br/api/cptec/v1/cidade/${encodeURIComponent(nomeCidade)}`
        );

        if (!cidadeBusca.data || cidadeBusca.data.length === 0) {
            return res.status(404).json({
                erro: true,
                codigo: 'CIDADE_NAO_ENCONTRADA',
                mensagem: 'Nenhuma cidade encontrada com o nome informado',
                nome_informado: nomeCidade
            });
        }

        const cidade = cidadeBusca.data[0];

        const climaBusca = await axios.get(
            `https://brasilapi.com.br/api/cptec/v1/clima/previsao/${cidade.id}`
        );

        const climaHoje = climaBusca.data.clima[0];

        res.status(200).json({
            nome: cidade.nome,
            estado: cidade.estado,
            clima: {
                temperatura_min: climaHoje.min,
                temperatura_max: climaHoje.max,
                condicao: climaHoje.condicao_desc || climaHoje.condicao,
                unidades: {
                    temperatura: '°C'
                }
            },
            consultado_em: new Date().toISOString()
        });

      } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                erro: true,
                codigo: 'CIDADE_NAO_ENCONTRADA',
                mensagem: 'Nenhuma cidade encontrada com o nome informado',
                nome_informado: nomeCidade
            });
        }

        res.status(503).json({
            erro: true,
            codigo: 'SERVICO_EXTERNO_INDISPONIVEL',
            mensagem: 'Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes',
            servico: 'CPTEC'
        });

    }
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;