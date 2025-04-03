export const options = [
    {
        value: "logistica",
        label: "Logística",
        children: [
            {
                value: "1",
                label: "Extravio formalizado no rastreio da transportadora",
            },
            { value: "2", label: "Pedido sem movimentação há mais de 10 dias" },
            { value: "3", label: "Sem retorno de acareação no prazo transportadora" },
            {
                value: "4",
                label: "Pedido sendo/ou devolvido pela transportadora - formalizado no rastreio",
            },
            {
                value: "5",
                label: "Transportadora informou que vai devolver pedido porém ainda sem atualização no rastreio",
            },
            {
                value: "6",
                label: "Troca de seller",
                children: [{ value: "1", label: "Estorno de frete" }],
            },
            {
                value: "7",
                label: "Atraso na entrega",
                children: [
                    { value: "2", label: "Estorno de frete" },
                    { value: "3", label: "Pedido de desculpas" },
                ],
            },
        ],
    },
    {
        value: "qualidade",
        label: "Qualidade",
        children: [
            {
                value: "1",
                label: "Peça recebida com defeito - Pedido de desculpas",
            },
        ],
    },
    {
        value: "pendencia_faturada",
        label: "Pendência faturada",
        children: [
            {
                value: "1",
                label: "Total - Cancelamento solicitado por loja ou CD após o faturamento",
            },
            {
                value: "2",
                label: "Parcial - Cancelamento solicitado por loja ou CD após o faturamento",
            },
        ],
    },
    {
        value: "pendencia_nao_faturada",
        label: "Pendência não faturada",
        children: [
            {
                value: "1",
                label: "Pedido de desculpas",
            },
            {
                value: "2",
                label: "Ressarcimento do valor pago manual",
            },
        ],
    },
];

export const optionsSAC = [
    {
        label: "Estorno na forma de pagamento",
        value: "1",
        fields: [
            { value: "valor", type: "currency", label: "Valor" },
            { value: "nsu", label: "NSU" },
        ],
    },
    {
        label: "Vale crédito gerado",
        value: "2",
        fields: [
            { value: "codigo_vale", label: "Código do vale" },
            { value: "valor", type: "currency", label: "Valor" },
            { value: "validade", label: "Validade", type: "date" },
        ],
    },
    {
        label: "Televendas realizado",
        value: "3",
        fields: [
            { value: "codigo_vale", label: "Código do vale" },
            { value: "valor", type: "currency", label: "Valor" },
            { value: "validade", label: "Validade", type: "date" },
            {
                value: "numero_pedido_gerado",
                label: "Número do pedido gerado",
                required: true,
            },
        ],
    },
    {
        label: "Pedido cópia gerado",
        value: "4",
        fields: [
            {
                value: "numero_pedido_gerado",
                label: "Número do pedido gerado",
                type: "number",
            },
        ],
    },
    {
        label: "Retirada de peça em loja",
        value: "5",
        fields: [
            {
                value: "numero_ticket_ajuste_estoque",
                label: "Número do ticket de ajuste de estoque",
                type: "number",
            },
            { value: "rastreio_envio_peca", label: "Rastreio do envio da peça" },
        ],
    },
    {
        label: "Depósito bancário",
        value: "6",
        fields: [
            {
                value: "numero_chamado_deposito",
                label: "Número do chamado de depósito",
            },
            { value: "valor", type: "currency", label: "Valor" },
            { value: "sac_descricao", label: "Descrição", type: "textarea" },
        ],
    },
    {
        label: "Cupom de desconto",
        value: "7",
        fields: [{ value: "nome_cupom", label: "Nome do cupom" }],
    },
];
