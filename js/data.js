// Base de Dados Corporativa Completa - ERP Distribuidora de Bebidas
const initialData = {
  // =========================================================================
  // ENGRADADO - SISTEMA DE GESTÃO & PDV PARA DISTRIBUIDORAS DE BEBIDAS
  // Informações completas extraídas do Plano-Mestre Oficial (Piloto Cuiabá-MT)
  // =========================================================================
  engradadoMasterPlan: {
    brand: {
      name: "Engradado",
      tagline: "O sistema da distribuidora de bebidas que vende rápido no balcão, entrega na rota e monta o pedido do cliente sozinho — mesmo sem internet.",
      city: "Cuiabá - MT",
      sefaz: "SEFAZ-MT (Contingência tpEmis 9 habilitada)",
      regime: "Simples Nacional (99,6% CST 60 / ICMS-ST Monofásico)",
      versao: "1.0 (Plano-mestre validado)"
    },
    numbersKey: {
      workspaces: "6 áreas de trabalho + Assistente Engradado (HERA: 85 telas; Protótipo anterior: 41 subtelas)",
      vendaBalcao: "2 toques, < 5 segundos, sem esperar SEFAZ (Mediana 1 item, R$ 16,00)",
      ticketMedio: "R$ 123,50 (com vendas atacado chegando a R$ 4.800+)",
      custoIA: "~R$ 33/mês por cliente (Motor IA Fast + Pro determinístico; pior caso ~R$ 84)",
      custoFiscal: "~R$ 0 marginal com motor próprio fiscal-engine Node (API terceira custaria R$ 150-340/mês)",
      mixPagamento: { pix: 73, cartao: 14, dinheiro: 13 },
      vendasIdentificadasMeta: "40% em 90 dias (atual medido: 41.2%)",
      planos: [
        { nome: "Balcão", preco: "R$ 399/mês", caixas: "Até 3", motoristas: "Quadro simples", creditosIA: "2.000 créditos/mês" },
        { nome: "Distribuidora (Recomendado)", preco: "R$ 699/mês", caixas: "Até 6", motoristas: "Até 3 motoristas + 2 vendedores externos", creditosIA: "4.000 créditos/mês + Resumo da Manhã" },
        { nome: "Rede", preco: "R$ 1.290/mês", caixas: "Ilimitados", motoristas: "Ilimitados + White Label", creditosIA: "4.000 créditos por loja + Resumo da Manhã" }
      ],
      pilotoData: "01/03/2027 (depois do Carnaval) em 1 caixa; virada total na semana de 22/03/2027",
      breakEven: "~100 clientes pagantes (meta para 2028)"
    },
    diagnosticHera: [
      {
        dor: "3 caixas que não se conversam",
        causaHera: "Cada PDV tem MySQL local isolado. Cargas manuais via JDBC root. Vendas sobem pelo EnviaVendas.jar a cada 5s sem canal entre caixas.",
        solucaoEngradado: "Banco central na nuvem com SQLite local sincronizado via PowerSync por delta. Livro-caixa unificado da loja em tempo real."
      },
      {
        dor: "TEF nunca funciona",
        causaHera: "UTILIZA_TEF=0, DLL ausente, sem configuração SiTef. A cliente usa maquininha Stone avulsa digitando o valor à mão.",
        solucaoEngradado: "PIX dinâmico com webhook instantâneo (73% do faturamento) e Smart POS integrado por API sem DLL nem PIN pad cabeado."
      },
      {
        dor: "Estoque negativo (780 de 797 itens zerados)",
        causaHera: "Saldo é campo editável. Baixa ocorre só no upload. Venda sem estoque liberada sem aviso. Entrada exige vínculo manual de fator.",
        solucaoEngradado: "Estoque como Razão de Movimentos imutável. Baixa no ato mesmo offline. Negativos visíveis com fila de regularização e contagem guiada."
      },
      {
        dor: "Pedido no site e faturamento em outro sistema",
        causaHera: "DAV nasce na retaguarda web, PDV importa e fatura, NF-e é outra tela de 657 KB. Queda de rede trava todo o faturamento.",
        solucaoEngradado: "Documento Único com esteira de transições (Orçamento → Pedido → Separar → Rota → Faturado). Faturar é 1 clique."
      },
      {
        dor: "85 telas em 3 níveis e 340 flags de permissão",
        causaHera: "Modelo genérico (mistura moda, oficina, restaurante com 108 itens de menu e 149 configurações escondidas).",
        solucaoEngradado: "6 Áreas de Trabalho focadas em bebidas + Assistente Engradado global. Perfis prontos com alçadas (Dono, Gerente, Caixa, Vendedor, Motorista)."
      },
      {
        dor: "Produto por produto para alterar preço",
        causaHera: "Edição por modal individual. Fardo e unidade são produtos separados (797/797 em UN). Não há grade nem colagem.",
        solucaoEngradado: "Grade-planilha tipo Excel com UN, FD e CX no mesmo produto. Reajuste em lote por fornecedor com prévia de margem e desfazer 30 dias."
      },
      {
        dor: "Queda de internet paralisa a loja",
        causaHera: "Offline do HERA exige servidor físico local na loja. Reenvio da contingência fiscal é manual e burocrático.",
        solucaoEngradado: "Offline no próprio aparelho (PC do caixa e celular). Fila fiscal assíncrona com contingência NFC-e tpEmis 9 automática."
      }
    ],
    sixWorkspaces: [
      {
        id: "vender",
        name: "1. Vender (Balcão / PDV)",
        tagline: "Venda rápida em 2 toques e < 5 segundos",
        features: [
          "Vários atendimentos em abas (Atend. 1, Atend. 2 Bar do Zé, +)",
          "Bipar ou buscar rápido (F2)",
          "Cliente rápido por telefone, nome ou CNPJ (F3)",
          "Preço automático por embalagem/faixa atacado/cliente (com botão 'Por que este preço?')",
          "Troca de casco na linha: 'Cascos: leva 1 cx · devolveu [ 1 ]'",
          "Puxar pedido de outros caixas ou do vendedor externo",
          "Cobrança F10: PIX dinâmico (73%), Smart POS, Dinheiro com troco, Fiado com limite",
          "Fila fiscal assíncrona: emissão automática sem travar a venda; contingência offline tpEmis 9"
        ]
      },
      {
        id: "pedidos",
        name: "2. Pedidos (Documento Único)",
        tagline: "Do orçamento ao faturamento sem trocar de tela",
        features: [
          "Documento único: Orçamento → Pedido → Separar → Em rota → Entregue → Faturado / NF-e",
          "Grade editável com digitação rápida ('3 cx skol', '10 fd heineken')",
          "Botão 'Repetir último pedido' com histórico de compras e variações destacadas",
          "Romaneio R-77 com ordem de paradas sugerida por bairro de Cuiabá",
          "Simulador App do Motorista offline: baixa com assinatura/foto e acerto cego"
        ]
      },
      {
        id: "produtos",
        name: "3. Produtos (Grade-Planilha & Estoque Razão)",
        tagline: "Embalagens UN/FD/CX no mesmo produto e razão imutável",
        features: [
          "Grade-planilha tipo Excel com colunas UN, FD(12), CX(24), Custo, Margem, Estoque e Preço Gelada",
          "Reajuste em lote com filtro Ambev, prévia de margem e botão 'Desfazer por 30 dias'",
          "Estoque como Razão de Movimentos (saldo derivado, nunca editável em campo texto)",
          "Contagem Cíclica 'Contar Hoje' (15 itens prioritários da curva A e divergentes)",
          "Notas a Receber (DF-e) com manifesto automático e fator de fardo memorizado"
        ]
      },
      {
        id: "clientes",
        name: "4. Clientes (Ficha 360º & Operação de Bebidas)",
        tagline: "Crédito, vasilhames e freezers em comodato",
        features: [
          "Ficha 360 com histórico de compras, ticket médio e produtos favoritos",
          "Fiado com Aging detalhado (0-30, 31-60, 61-90, >90 dias)",
          "Régua de cobrança automática por WhatsApp com PIX dinâmico gerado",
          "Livro de Cascos por cliente e tipo (600ml, 1L, barris 30L/50L) com alerta de atraso",
          "Comodato de Freezers e Chopeiras com controle de patrimônio e meta mensal de compras",
          "Recompra prevista calculada pelo giro histórico"
        ]
      },
      {
        id: "caixa-contas",
        name: "5. Caixa & Contas",
        tagline: "Livro-caixa unificado da loja e fechamento cego",
        features: [
          "Livro-caixa único da loja consolidando todos os terminais em tempo real",
          "Fechamento cego: operador conta apenas dinheiro físico; PIX e cartão vêm conciliados",
          "Sangria inteligente com alerta de teto em gaveta",
          "Painel Fiscal SEFAZ-MT: fila de NFC-e/NF-e e contingência tpEmis 9",
          "Painel Saúde dos Dispositivos: sync, notas na fila, bateria e certificado A1 (alerta 30 dias)"
        ]
      },
      {
        id: "painel",
        name: "6. Painel (Visão do Dia & Relatórios)",
        tagline: "Carimbo de integridade e mapa 1:1 dos 28 relatórios do HERA",
        features: [
          "Carimbo 'Dados consolidados até 14:02 · 1 aparelho com 3 pendências'",
          "Números reais da distribuidora (R$ 14.820 dia, Balcão R$ 16 mediana, PIX 73%)",
          "Alertas operacionais acionáveis (recompras de hoje, contingências, freezers ociosos)",
          "Biblioteca dos 28 relatórios do HERA com exportação CSV, XLSX e PDF em todas as telas"
        ]
      }
    ],
    aiAssistantPlan: {
      router: "Portão Determinístico (Validação de Acesso + Créditos) → Motor IA Fast (Intérprete/Roteador + Ferramentas Simples) → Motor IA Pro (Planejador de Análises Compostas)",
      safetyRule: "O sistema calcula os preços e impostos de forma determinística; o motor de inteligência apenas organiza o rascunho com fontes citadas. Nenhuma escrita é definitiva sem 1 clique de confirmação humana.",
      costReal: "~R$ 33/mês no cenário base (100 interações/dia + 10 análises aprofundadas/mês). Franquia de 4.000 créditos incluída no plano Distribuidora.",
      safetyCap: "Teto de segurança de R$ 100/mês por loja garantido no gateway",
      casesStars: [
        {
          id: "bar-do-ze-repetir",
          title: "Orçamento Bar do Zé igual ao último + 10 fd Heineken",
          prompt: "orçamento pro bar do zé igual o último mas 10 fardo de heineken",
          model: "Motor IA Fast (Effort Low · ~22k tokens, 17k cache)",
          tempo: "3.2 segundos",
          custo: "R$ 0,010 (1 crédito)",
          draftResult: {
            client: "Bar do Zé (Bairro CPA IV, Cuiabá - MT)",
            baseRef: "Pedido anterior #A-0988 (12/09/2026)",
            itemsCount: 14,
            total: 2418.40,
            previousTotal: 2346.60,
            diffSummary: "Heineken Long Neck 8 FD → 10 FD (+2 fardos adicionados)",
            pricingRule: "Tabela 'Bares Cuiabá' vigente aplicada automaticamente",
            stockWarning: "1 item com estoque baixo no depósito: Cerveja Original 600ml (12 cx disponíveis)",
            sources: "Pedido #A-0988, Tabela Bares vigente, Estoque às 14:02"
          }
        },
        {
          id: "whatsapp-paste",
          title: "Colar pedido recebido no WhatsApp",
          prompt: "manda 5 cx brahma 600, 2 fd coca 2l e 1 saco de gelo pro Bar do Zé",
          model: "Motor IA Fast (interpretar_pedido_texto em lote)",
          tempo: "2.8 segundos",
          custo: "R$ 0,015 (2 créditos)",
          draftResult: {
            client: "Bar do Zé",
            matchedItems: [
              { item: "Brahma 600ml Retornável", package: "CX(24)", qty: 5, unitPrice: 98.00, total: 490.00, cascos: "5 caixas a recolher" },
              { item: "Refrigerante Coca-Cola 2L", package: "FD(6)", qty: 2, unitPrice: 56.00, total: 112.00, cascos: "Sem casco (descartável)" },
              { item: "Gelo Filtrado em Cubos 10kg", package: "Pacote", qty: 1, unitPrice: 22.00, total: 22.00, cascos: "Sem casco" }
            ],
            total: 624.00,
            confidence: "100% de casamento exato com catálogo de Cuiabá",
            sources: "Catálogo ativo, Tabela Bares Cuiabá"
          }
        },
        {
          id: "top-produtos-60dias",
          title: "Orçamento com os mais comprados nos últimos 60 dias",
          prompt: "orçamento pro Bar do Zé com o que ele mais levou nos últimos 60 dias",
          model: "Motor IA Fast",
          tempo: "3.5 segundos",
          custo: "R$ 0,010 (1 crédito)",
          draftResult: {
            client: "Bar do Zé",
            criteria: "Produtos com maior frequência de compra e quantidade mediana",
            itemsCount: 8,
            total: 1890.50,
            sources: "Histórico de faturamento de 60 dias, estoque atualizado"
          }
        },
        {
          id: "consulta-vendas-semana",
          title: "Análise de vendas de lata e margem na semana",
          prompt: "quanto vendemos de cerveja lata essa semana e qual foi a margem média?",
          model: "Motor IA Fast + Visão Semântica de Vendas",
          tempo: "1.9 segundos",
          custo: "R$ 0,005 (1 crédito)",
          answerText: "Nesta semana (segunda até hoje às 14:02), vendemos 842 fardos de cerveja lata (Skol 350ml e Puro Malte). O faturamento total foi de R$ 32.180,00 com margem média líquida de 34,2%. O produto mais lucrativo foi a Skol Lata 350ml FD(12) com margem de 36%."
        },
        {
          id: "regua-cobranca-fiado",
          title: "Régua de cobrança de bares em atraso",
          prompt: "quais bares estão com fiado vencendo há mais de 30 dias e monte a mensagem com PIX",
          model: "Motor IA Fast + propor_cobranca",
          tempo: "2.4 segundos",
          custo: "R$ 0,010 (1 crédito)",
          answerText: "Identifiquei 2 clientes com parcelas vencidas há mais de 30 dias: Bar do Zé (R$ 400,00 - 12 dias de atraso na faixa 31-60) e Conveniência Pantanal (R$ 680,00 - 38 dias). Montei o lote de mensagens WhatsApp com chave PIX dinâmica para cobrança com 1 clique."
        },
        {
          id: "resumo-manha-dono",
          title: "Resumo da Manhã do Dono (Batch das 06:00)",
          prompt: "resumo da manhã executivo de ontem e alertas de hoje",
          model: "Motor IA Fast via Batch API (50% desconto · R$ 0,01/dia)",
          tempo: "Instantâneo (pré-calculado)",
          custo: "R$ 0,010",
          answerText: "Bom dia! Ontem fechamos em R$ 16.420,00 (+8% acima da média de terça-feira). 74% no PIX. Alertas de hoje: 3 bares com recompra prevista no roteiro CPA (Bar do Zé, Bar do Gordo, Espetinho Cuiabano); 1 freezer Ambev no Bar do Zé com compra mensal abaixo de 80%; Cerveja Original 600ml com estoque no depósito em 12 caixas (sugerir pedido Ambev)."
        }
      ]
    },
    hardwareAgent: {
      pattern: "Agente local no processo Electron (Node) com pareamento por código de 8 letras e painel em localhost",
      peripherals: [
        { name: "Impressora Térmica Não Fiscal ESC/POS", models: "Elgin i9 / Bematech MP-4200 (USB/Rede/Serial)", status: "Conectada (USB001)", speed: "180 mm/s" },
        { name: "Gaveta de Dinheiro Automática", trigger: "Acionamento pelo pino RJ11 da impressora", status: "Pronta" },
        { name: "Display de Cliente para QR do PIX", resolution: "Display LCD 800x480 no balcão", status: "Sincronizado" },
        { name: "Balança de Balcão (Gelo e Granel)", protocol: "Serial Toledo / Filizola", status: "Calibrada" },
        { name: "Leitor de Código de Barras", mode: "Emulação de Teclado (USB HID)", status: "Ativo" }
      ]
    },
    deviceHealthList: [
      { id: "DEV-01", device: "PC Caixa 01 (Balcão)", os: "Windows 11 Pro · Intel i5 8GB SSD", status: "online", lastSync: "há 20 seg", queueItems: 0, certA1: "Válido (214 dias restantes)", printer: "Bematech MP-4200 (OK)" },
      { id: "DEV-02", device: "PC Caixa 02 (Reserva)", os: "Windows 10 · Intel i3 8GB SSD", status: "online", lastSync: "há 1 min", queueItems: 0, certA1: "Válido (214 dias restantes)", printer: "Elgin i9 (OK)" },
      { id: "DEV-03", device: "Celular Vendedor (Ana)", os: "Android 14 · App Capacitor", status: "online", lastSync: "há 4 min", queueItems: 0, certA1: "Via Servidor", printer: "Não aplicável" },
      { id: "DEV-04", device: "Celular Motorista (Marcos - Rota CPA)", os: "Android 13 · App Capacitor", status: "offline", lastSync: "há 38 min", queueItems: 12, queueDesc: "12 entregas e baixas salvas no SQLite nativo", certA1: "Via Servidor", printer: "Não aplicável" }
    ],
    contarHojePriorities: [
      { id: "PROD-CBA-001", name: "Skol 350ml lata (UN)", curve: "Curva A", stockSystem: 312, counted: null, diff: 0, location: "Câmara Fria", status: "pendente" },
      { id: "PROD-CBA-002", name: "Brahma 600ml retornável (UN)", curve: "Curva A / Negativo", stockSystem: -24, counted: null, diff: 0, location: "Depósito Principal", status: "critico" },
      { id: "PROD-CBA-003", name: "Heineken Long Neck 330ml (UN)", curve: "Curva A", stockSystem: 180, counted: null, diff: 0, location: "Câmara Fria", status: "pendente" },
      { id: "PROD-CBA-004", name: "Coca-Cola 2L Pet (UN)", curve: "Curva A", stockSystem: 140, counted: null, diff: 0, location: "Galpão R4", status: "pendente" },
      { id: "PROD-CBA-005", name: "Cerveja Original 600ml (UN)", curve: "Divergente", stockSystem: 48, counted: null, diff: 0, location: "Depósito Principal", status: "pendente" },
      { id: "PROD-CBA-006", name: "Gelo Filtrado em Cubos 10kg", curve: "Alto Giro", stockSystem: 180, counted: null, diff: 0, location: "Câmara Fria G1", status: "pendente" },
      { id: "PROD-CBA-007", name: "Água Puríssima 500ml c/ gás", curve: "Curva B", stockSystem: 250, counted: null, diff: 0, location: "Galpão R5", status: "pendente" },
      { id: "PROD-CBA-008", name: "Carvão Vegetal 3kg", curve: "Sem contagem 30d", stockSystem: 120, counted: null, diff: 0, location: "Pátio Externo", status: "pendente" }
    ],
    dfeIncomingNotes: [
      {
        chNFe: "51261002814881000192550010000841281098421098",
        nNF: "000.084.128",
        emitente: "Ambev S.A. - Filial Cuiabá",
        cnpjEmitente: "02.814.881/0001-92",
        dhEmi: "14/10/2026 09:15",
        vNF: 14850.00,
        statusDF: "Ciência da Emissão Efetuada",
        itensCount: 4,
        memorizedFactor: "CX c/ 24 e FD c/ 12 já vinculados com histórico 100% automático",
        action: "Pronta para Manifestação e Entrada no Estoque"
      },
      {
        chNFe: "51261003418290000144550010000329101847120984",
        nNF: "000.032.910",
        emitente: "Coca-Cola FEMSA Brasil - CD Cuiabá",
        cnpjEmitente: "03.418.290/0001-44",
        dhEmi: "13/10/2026 16:40",
        vNF: 6240.00,
        statusDF: "Confirmada a Operação",
        itensCount: 3,
        memorizedFactor: "Fardo c/ 6 unidades memorizado",
        action: "Estoque e Contas a Pagar Atualizados"
      }
    ],
    romaneioEntregas: {
      id: "R-77",
      data: "14/10/2026",
      veiculo: "Fiorino Placa QBO-4819",
      motorista: "Marcos Vinicius",
      bairrosRota: "CPA I, II, III e IV · Morada do Ouro · Cuiabá",
      totalParadas: 9,
      concluidas: 6,
      pendentes: 3,
      totalValor: 9480.00,
      paradas: [
        { seq: 1, doc: "PED-1040", cliente: "Lanchonete Pantanal", endereco: "Av. Brasil, 45 - CPA II", valor: 1120.00, status: "Entregue", pgto: "PIX Recebido", cascosRecebidos: "4 cx 600ml" },
        { seq: 2, doc: "PED-1041", cliente: "Espetinho Cuiabano", endereco: "Rua 14, 210 - CPA III", valor: 850.00, status: "Entregue", pgto: "Dinheiro R$ 850", cascosRecebidos: "2 cx 600ml" },
        { seq: 3, doc: "PED-1042", cliente: "Bar do Zé", endereco: "R. das Flores, 120 - CPA IV", valor: 2418.40, status: "Em rota (Próxima parada)", pgto: "Fiado Faturado", cascosEsperados: "6 cx 600ml", comodatoChecagem: "Verificar freezer Ambev" },
        { seq: 4, doc: "PED-1043", cliente: "Mercearia Santa Rosa", endereco: "Av. Antártica, 88 - Santa Rosa", valor: 1890.00, status: "Pendente", pgto: "A Receber no local (Smart POS)", cascosEsperados: "4 cx 600ml" }
      ]
    }
  },

  products: [
    {
      id: 'PROD-001',
      name: 'Chopp Pilsen Barril 50L Inox',
      category: 'barris',
      type: 'b2b',
      price: 420.00,
      wholesalePrice: 395.00,
      cost: 260.00,
      stock: 15,
      stockVarejo: 5,
      stockAtacado: 10,
      wholesalePackage: 'Barril 50L Inox',
      minStock: 20,
      maxStock: 100,
      location: 'Câmara Fria A1',
      sku: 'CHP-PIL-50L',
      isReturnable: true,
      vasilhameType: 'Barril 50L Inox',
      barcode: '789123456001',
      registeredDate: '2024-01-10',
      badge: 'B2B Retornável',
      ncm: '2203.00.00',
      cest: '03.001.00',
      cfop: '5.405',
      supplier: 'Cervejaria Paulistana S/A'
    },
    {
      id: 'PROD-002',
      name: 'Chopp IPA Artesanal Barril 30L Inox',
      category: 'barris',
      type: 'b2b',
      price: 360.00,
      wholesalePrice: 340.00,
      cost: 210.00,
      stock: 5,
      stockVarejo: 3,
      stockAtacado: 2,
      wholesalePackage: 'Barril 30L Inox',
      minStock: 15,
      maxStock: 50,
      location: 'Câmara Fria A2',
      sku: 'CHP-IPA-30L',
      isReturnable: true,
      vasilhameType: 'Barril 30L Inox',
      barcode: '789123456002',
      registeredDate: '2024-02-15',
      badge: 'B2B Retornável',
      ncm: '2203.00.00',
      cest: '03.001.00',
      cfop: '5.405',
      supplier: 'Cervejaria Paulistana S/A'
    },
    {
      id: 'PROD-003',
      name: 'Cerveja Brahma 600ml Retornável (Cuiabá)',
      packages: [
        { unit: 'UN', factor: 1, ean: '7891149103248', price: 6.90, wholesalePrice: 6.50 },
        { unit: 'CX(24)', factor: 24, ean: '7891149103255', price: 98.00, wholesalePrice: 92.00, atacadoFardo: 28.00 }
      ],
      negativeStockAlert: true,
      cascoType: 'Caixa 24x 600ml c/ Vasilhame',
      category: 'cervejas',
      type: 'mixed',
      price: 138.00,
      wholesalePrice: 128.00,
      cost: 92.00,
      stock: 310,
      stockVarejo: 50,
      stockAtacado: 260,
      wholesalePackage: 'Caixa c/ 24 un (Palete: 45 cx)',
      minStock: 100,
      maxStock: 600,
      location: 'Galpão Principal - R2',
      sku: 'CER-600-CX24',
      isReturnable: true,
      vasilhameType: 'Caixa 24x 600ml c/ Vasilhame',
      barcode: '789123456003',
      registeredDate: '2023-11-20',
      badge: 'Retornável',
      ncm: '2203.00.00',
      cest: '03.002.00',
      cfop: '5.405',
      supplier: 'Ambev Distribuição'
    },
    {
      id: 'PROD-004',
      name: 'Cerveja Skol 350ml Lata (Cuiabá)',
      packages: [
        { unit: 'UN', factor: 1, ean: '7891149200015', price: 3.29, wholesalePrice: 3.15 },
        { unit: 'FD(12)', factor: 12, ean: '7891149200022', price: 37.90, wholesalePrice: 35.50 },
        { unit: 'CX(24)', factor: 24, ean: '7891149200039', price: 74.90, wholesalePrice: 69.90 }
      ],
      cost: 2.41,
      marginPct: 36,
      location: 'Câmara Fria A1',
      geladaPrice: 3.50,
      category: 'cervejas',
      type: 'b2c',
      price: 46.80,
      wholesalePrice: 41.50,
      cost: 32.00,
      stock: 580,
      stockVarejo: 120,
      stockAtacado: 460,
      wholesalePackage: 'Fardo c/ 12 un (Palete: 80 fd)',
      minStock: 150,
      maxStock: 1000,
      location: 'Galpão Principal - R1',
      sku: 'CER-LAT-PK12',
      isReturnable: false,
      barcode: '789123456004',
      registeredDate: '2024-03-05',
      badge: 'Descartável / Varejo',
      ncm: '2203.00.00',
      cest: '03.003.00',
      cfop: '5.102',
      supplier: 'Ambev Distribuição'
    },
    {
      id: 'PROD-005',
      name: 'Whisky 12 Anos Reserva Escocês 1L',
      category: 'destilados',
      type: 'mixed',
      price: 189.90,
      wholesalePrice: 169.00,
      cost: 135.00,
      stock: 64,
      stockVarejo: 16,
      stockAtacado: 48,
      wholesalePackage: 'Caixa c/ 6 Garrafas',
      minStock: 20,
      maxStock: 120,
      location: 'Depósito Seguro D1',
      sku: 'WHI-12A-1L',
      isReturnable: false,
      barcode: '789123456005',
      registeredDate: '2023-08-12',
      badge: 'Destilados',
      ncm: '2208.30.20',
      cest: '03.010.00',
      cfop: '5.102',
      supplier: 'Diageo Brasil'
    },
    {
      id: 'PROD-006',
      name: 'Gin London Dry Artesanal 750ml',
      category: 'destilados',
      type: 'mixed',
      price: 115.00,
      wholesalePrice: 98.00,
      cost: 72.00,
      stock: 82,
      stockVarejo: 22,
      stockAtacado: 60,
      wholesalePackage: 'Caixa c/ 6 Garrafas',
      minStock: 30,
      maxStock: 150,
      location: 'Depósito Seguro D2',
      sku: 'GIN-LON-750',
      isReturnable: false,
      barcode: '789123456006',
      registeredDate: '2024-04-18',
      badge: 'Destilados',
      ncm: '2208.50.00',
      cest: '03.011.00',
      cfop: '5.102',
      supplier: 'Pernod Ricard'
    },
    {
      id: 'PROD-007',
      name: 'Vodka Importada Tripla Destilação 1L',
      category: 'destilados',
      type: 'mixed',
      price: 94.50,
      wholesalePrice: 82.00,
      cost: 61.00,
      stock: 95,
      stockVarejo: 25,
      stockAtacado: 70,
      wholesalePackage: 'Caixa c/ 12 Garrafas',
      minStock: 25,
      maxStock: 200,
      location: 'Depósito Seguro D3',
      sku: 'VDK-IMP-1L',
      isReturnable: false,
      barcode: '789123456007',
      registeredDate: '2023-09-25',
      badge: 'Destilados',
      ncm: '2208.60.00',
      cest: '03.012.00',
      cfop: '5.102',
      supplier: 'Pernod Ricard'
    },
    {
      id: 'PROD-008',
      name: 'Energético Premium 250ml Pack c/ 24 Latas',
      category: 'nao-alcoolicos',
      type: 'mixed',
      price: 168.00,
      wholesalePrice: 148.00,
      cost: 118.00,
      stock: 140,
      stockVarejo: 30,
      stockAtacado: 110,
      wholesalePackage: 'Fardo c/ 24 un (Palete: 54 fd)',
      minStock: 50,
      maxStock: 300,
      location: 'Galpão Principal - R3',
      sku: 'NRG-250-PK24',
      isReturnable: false,
      barcode: '789123456008',
      registeredDate: '2024-05-10',
      badge: 'Bebida Energética',
      ncm: '2202.99.00',
      cest: '03.020.00',
      cfop: '5.102',
      supplier: 'Red Bull Brasil'
    },
    {
      id: 'PROD-009',
      name: 'Refrigerante Cola 2L Fardo c/ 6 Unidades',
      category: 'nao-alcoolicos',
      type: 'mixed',
      price: 48.00,
      wholesalePrice: 42.00,
      cost: 34.50,
      stock: 220,
      stockVarejo: 40,
      stockAtacado: 180,
      wholesalePackage: 'Fardo c/ 6 un (Palete: 60 fd)',
      minStock: 80,
      maxStock: 400,
      location: 'Galpão Principal - R4',
      sku: 'REF-COL-FD6',
      isReturnable: false,
      barcode: '789123456009',
      registeredDate: '2023-10-30',
      badge: 'Refrigerante',
      ncm: '2202.10.00',
      cest: '03.021.00',
      cfop: '5.405',
      supplier: 'Coca-Cola FEMSA'
    },
    {
      id: 'PROD-010',
      name: 'Água Mineral c/ Gás 500ml Fardo c/ 12',
      category: 'nao-alcoolicos',
      type: 'mixed',
      price: 26.40,
      wholesalePrice: 22.00,
      cost: 14.00,
      stock: 350,
      stockVarejo: 70,
      stockAtacado: 280,
      wholesalePackage: 'Fardo c/ 12 un (Palete: 90 fd)',
      minStock: 100,
      maxStock: 500,
      location: 'Galpão Principal - R5',
      sku: 'AGU-GAS-FD12',
      isReturnable: false,
      barcode: '789123456010',
      registeredDate: '2024-06-01',
      badge: 'Água Mineral',
      ncm: '2201.10.00',
      cest: '03.022.00',
      cfop: '5.102',
      supplier: 'Fonte Minalba'
    },
    {
      id: 'PROD-011',
      name: 'Gelo Filtrado em Cubos Pacote 10kg',
      category: 'outros',
      type: 'mixed',
      price: 22.00,
      wholesalePrice: 18.00,
      cost: 8.50,
      stock: 180,
      stockVarejo: 30,
      stockAtacado: 150,
      wholesalePackage: 'Fardo c/ 5 Pacotes (50kg)',
      minStock: 50,
      maxStock: 300,
      location: 'Câmara Fria Gelo G1',
      sku: 'GEL-CUB-10K',
      isReturnable: false,
      barcode: '789123456011',
      registeredDate: '2024-02-28',
      badge: 'Gelo',
      ncm: '2201.90.00',
      cest: '03.023.00',
      cfop: '5.102',
      supplier: 'Gelo Polar Ltda'
    },
    {
      id: 'PROD-012',
      name: 'Cerveja Litrão 1000ml Caixa c/ 12 Garrafas',
      category: 'cervejas',
      type: 'mixed',
      price: 96.00,
      wholesalePrice: 88.00,
      cost: 65.00,
      stock: 195,
      stockVarejo: 35,
      stockAtacado: 160,
      wholesalePackage: 'Caixa c/ 12 un (Palete: 50 cx)',
      minStock: 60,
      maxStock: 350,
      location: 'Galpão Principal - R2',
      sku: 'CER-LIT-CX12',
      isReturnable: true,
      vasilhameType: 'Caixa 12x 1L c/ Vasilhame',
      barcode: '789123456012',
      registeredDate: '2023-12-05',
      badge: 'Retornável',
      ncm: '2203.00.00',
      cest: '03.002.00',
      cfop: '5.405',
      supplier: 'Ambev Distribuição'
    }
  ],

  b2bClients: [
    {
      id: 'CLI-001',
      cnpj: '24.891.102/0001-55',
      ie: '13.512.980-1',
      corporateName: 'José Aparecido dos Santos & Cia Ltda',
      tradeName: 'Bar do Zé (Cliente Estrela Cuiabá)',
      segment: 'Bar & Choperia (B2B)',
      status: 'ativo',
      creditLimit: 3000.00,
      creditUsed: 1240.00,
      availableCredit: 1760.00,
      paymentTerms: 'Fiado Semanal / PIX Dinâmico',
      contactName: 'Seu Zé (José Aparecido)',
      contactRole: 'Proprietário',
      phone: '(65) 99234-5678',
      email: 'bardoze.cuiaba@gmail.com',
      address: 'Rua das Flores, 120 - Bairro CPA IV, Cuiabá - MT',
      cep: '78058-200',
      customerSince: '12/03/2024',
      totalPurchases: 48920.00,
      ordersCount: 38,
      agingDebt: {
        current0_30: 840.00,
        due31_60: 400.00,
        due61_90: 0.00,
        dueOver90: 0.00,
        daysOverdue: 12,
        pixCobranzaUrl: 'https://pix.bcb.gov.br/qr/5198421098421'
      },
      cascosBalance: {
        caixas600: 6,
        caixasLitro: 0,
        barril50: 0,
        barril30: 0,
        retentionDays: 14,
        warning: '6 caixas 600ml devidas (Previsão de recolhimento na próxima entrega)'
      },
      comodatoAssets: [
        {
          id: 'PAT-FRZ-8821',
          name: 'Freezer Dupla Ação Ambev 530L',
          contract: 'COM-2024-089',
          installedDate: '15/04/2024',
          targetMonthlyCases: 30,
          currentMonthCases: 24,
          achievementPct: 80,
          status: 'Ativo em Monitoramento (Meta 80%)'
        }
      ],
      lastOrderSummary: {
        id: '#A-0988',
        date: '12/09/2026',
        itemsCount: 14,
        total: 2346.60,
        heinekenQty: 8,
        brahmaQty: 5
      },
      ordersHistory: [
        {
          id: '#A-0988',
          nfe: '000.041.209',
          date: '12/09/2026',
          total: 2346.60,
          status: 'Entregue / Faturado',
          paymentStatus: 'Fiado (R$ 400 vencido + R$ 840 a vencer)',
          itemsCount: 14,
          items: [
            { name: 'Heineken Long Neck 330ml FD(6)', qty: 8, unitPrice: 35.90, total: 287.20 },
            { name: 'Cerveja Brahma 600ml CX c/ 24', qty: 5, unitPrice: 98.00, total: 490.00 },
            { name: 'Cerveja Skol Lata 350ml FD(12)', qty: 10, unitPrice: 37.90, total: 379.00 },
            { name: 'Refrigerante Coca-Cola 2L FD(6)', qty: 4, unitPrice: 56.00, total: 224.00 },
            { name: 'Gelo Filtrado em Cubos 10kg', qty: 6, unitPrice: 22.00, total: 132.00 }
          ]
        }
      ]
    },
    {
      id: 'CLI-009',
      cnpj: '18.342.981/0001-44',
      ie: '109.842.190.114',
      corporateName: 'Boteco & Gastronomia Vila Madalena Ltda',
      tradeName: 'Boteco Vila Madalena',
      segment: 'Bar & Gastronomia',
      status: 'ativo',
      creditLimit: 35000.00,
      creditUsed: 14200.00,
      paymentTerms: 'Faturado 15/30 Dias',
      contactName: 'Carlos Mendonça',
      contactRole: 'Gerente de Compras',
      phone: '(11) 98765-4321',
      email: 'compras@botecovilamadalena.com.br',
      address: 'Rua Fradique Coutinho, 890 - Pinheiros, São Paulo - SP',
      cep: '05416-001',
      customerSince: '14/03/2023',
      totalPurchases: 184520.00,
      ordersCount: 42,
      cascosBalance: {
        barril50: 8,
        barril30: 4,
        caixas600: 45,
        caixasLitro: 12
      },
      ordersHistory: [
        {
          id: 'PED-B2B-8941',
          nfe: '000.084.218',
          date: '15/09/2026',
          total: 4890.00,
          status: 'Entregue / Faturado',
          paymentStatus: 'A Vencer (30 DDL)',
          itemsCount: 33,
          items: [
            { name: 'Chopp Pilsen Barril 50L', qty: 6, unitPrice: 420.00, total: 2520.00 },
            { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 15, unitPrice: 138.00, total: 2070.00 },
            { name: 'Gelo Filtrado Pacote 10kg', qty: 12, unitPrice: 22.00, total: 264.00 }
          ]
        },
        {
          id: 'PED-B2B-8890',
          nfe: '000.083.914',
          date: '02/09/2026',
          total: 5120.00,
          status: 'Liquidado',
          paymentStatus: 'Pago',
          itemsCount: 36,
          items: [
            { name: 'Chopp Pilsen Barril 50L', qty: 8, unitPrice: 420.00, total: 3360.00 },
            { name: 'Chopp IPA Barril 30L', qty: 4, unitPrice: 360.00, total: 1440.00 },
            { name: 'Gelo Filtrado 10kg', qty: 15, unitPrice: 22.00, total: 330.00 }
          ]
        },
        {
          id: 'PED-B2B-8812',
          nfe: '000.083.402',
          date: '18/08/2026',
          total: 4200.00,
          status: 'Liquidado',
          paymentStatus: 'Pago',
          itemsCount: 28,
          items: [
            { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 30, unitPrice: 138.00, total: 4140.00 }
          ]
        }
      ]
    },
    {
      id: 'CLI-002',
      cnpj: '04.912.441/0002-18',
      ie: '114.392.001.218',
      corporateName: 'Supermercados & Distribuidora Esperança S/A',
      tradeName: 'Rede Esperança Matriz',
      segment: 'Rede de Supermercados',
      status: 'ativo',
      creditLimit: 120000.00,
      creditUsed: 98400.00,
      paymentTerms: 'Boleto Bancário 21/42 DDL',
      contactName: 'Fernanda Toledo',
      contactRole: 'Diretoria de Suprimentos',
      phone: '(11) 97112-9900',
      email: 'suprimentos@superesperanca.com.br',
      address: 'Av. das Nações Unidas, 12.400 - Brooklin, São Paulo - SP',
      cep: '04578-000',
      customerSince: '09/01/2022',
      totalPurchases: 642890.00,
      ordersCount: 88,
      cascosBalance: {
        barril50: 0,
        barril30: 0,
        caixas600: 210,
        caixasLitro: 85
      },
      ordersHistory: [
        {
          id: 'PED-B2B-8920',
          nfe: '000.084.217',
          date: '12/09/2026',
          total: 14200.00,
          status: 'Em Trânsito',
          paymentStatus: 'A Vencer (Boleto)',
          itemsCount: 112,
          items: [
            { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 60, unitPrice: 138.00, total: 8280.00 },
            { name: 'Cerveja Litrão 1000ml Cx c/ 12', qty: 40, unitPrice: 96.00, total: 3840.00 },
            { name: 'Energético Premium 250ml Pack c/ 24', qty: 12, unitPrice: 168.00, total: 2016.00 }
          ]
        },
        {
          id: 'PED-B2B-8850',
          nfe: '000.083.712',
          date: '25/08/2026',
          total: 22800.00,
          status: 'Liquidado',
          paymentStatus: 'Pago',
          itemsCount: 180,
          items: [
            { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 120, unitPrice: 138.00, total: 16560.00 },
            { name: 'Refrigerante Cola 2L Fardo c/ 6', qty: 130, unitPrice: 48.00, total: 6240.00 }
          ]
        }
      ]
    },
    {
      id: 'CLI-003',
      cnpj: '32.651.109/0001-90',
      ie: '145.901.882.110',
      corporateName: 'Espeto Prime Eventos e Bar Eireli',
      tradeName: 'Espetaria Prime Show',
      segment: 'Eventos & Espetaria',
      status: 'analise',
      creditLimit: 25000.00,
      creditUsed: 23800.00,
      paymentTerms: 'PIX ou Cartão no Ato',
      contactName: 'Marcos Vinícius',
      contactRole: 'Sócio Proprietário',
      phone: '(11) 99881-2244',
      email: 'eventos@espetoprime.com.br',
      address: 'Alameda dos Anapurus, 320 - Moema, São Paulo - SP',
      cep: '04087-001',
      customerSince: '20/10/2024',
      totalPurchases: 68400.00,
      ordersCount: 16,
      cascosBalance: {
        barril50: 12,
        barril30: 8,
        caixas600: 18,
        caixasLitro: 0
      },
      ordersHistory: [
        {
          id: 'PED-B2B-8874',
          nfe: '000.083.890',
          date: '08/09/2026',
          total: 6240.00,
          status: 'Liquidado',
          paymentStatus: 'Pago (PIX)',
          itemsCount: 34,
          items: [
            { name: 'Chopp Pilsen Barril 50L', qty: 10, unitPrice: 420.00, total: 4200.00 },
            { name: 'Chopp IPA Barril 30L', qty: 4, unitPrice: 360.00, total: 1440.00 },
            { name: 'Gelo em Cubos 10kg', qty: 20, unitPrice: 22.00, total: 440.00 }
          ]
        }
      ]
    }
  ],

  // Orçamentos B2B
  quotes: [
    {
      id: 'ORC-2026-0491',
      clientId: 'CLI-001',
      clientName: 'Boteco Vila Madalena',
      date: '22/09/2026',
      validUntil: '29/09/2026',
      total: 6720.00,
      status: 'aberto', // 'pendente' | 'aprovado' | 'cancelado'
      itemsCount: 42,
      seller: 'Rodrigo Martins',
      items: [
        { name: 'Chopp Pilsen Barril 50L', qty: 8, unitPrice: 420.00, total: 3360.00 },
        { name: 'Chopp IPA Barril 30L', qty: 6, unitPrice: 360.00, total: 2160.00 },
        { name: 'Gelo Filtrado 10kg', qty: 20, unitPrice: 20.00, total: 400.00 },
        { name: 'Refrigerante Cola 2L Fardo c/ 6', qty: 15, unitPrice: 48.00, total: 720.00 }
      ]
    },
    {
      id: 'ORC-2026-0488',
      clientId: 'CLI-002',
      clientName: 'Rede Esperança Matriz',
      date: '21/09/2026',
      validUntil: '28/09/2026',
      total: 18450.00,
      status: 'aberto',
      itemsCount: 150,
      seller: 'Rodrigo Martins',
      items: [
        { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 90, unitPrice: 135.00, total: 12150.00 },
        { name: 'Cerveja Litrão 1000ml Cx c/ 12', qty: 50, unitPrice: 94.00, total: 4700.00 },
        { name: 'Energético Premium 250ml Pack c/ 24', qty: 10, unitPrice: 160.00, total: 1600.00 }
      ]
    },
    {
      id: 'ORC-2026-0480',
      clientId: 'CLI-003',
      clientName: 'Espetaria Prime Show',
      date: '19/09/2026',
      validUntil: '26/09/2026',
      total: 3480.00,
      status: 'cancelado',
      itemsCount: 18,
      seller: 'Lucas Toledo',
      items: [
        { name: 'Gin London Dry Artesanal 750ml', qty: 12, unitPrice: 110.00, total: 1320.00 },
        { name: 'Vodka Importada 1L', qty: 12, unitPrice: 90.00, total: 1080.00 },
        { name: 'Energético Premium 250ml Pack c/ 24', qty: 6, unitPrice: 165.00, total: 990.00 }
      ]
    }
  ],

  // Caixas & Movimentação
  cashRegisters: [
    {
      id: 'CX-01',
      name: 'Caixa 01 - Balcão Varejo',
      operator: 'Lucas Toledo',
      status: 'aberto',
      openedAt: '22/09/2026 07:30',
      initialFloat: 500.00,
      cashInSales: 2450.00,
      pixSales: 3820.00,
      tefSales: 5120.00,
      sangrias: 1000.00,
      suprimentos: 200.00,
      currentBalance: 7270.00
    },
    {
      id: 'CX-02',
      name: 'Caixa 02 - Frente Touch Screen',
      operator: 'Juliana Silva',
      status: 'aberto',
      openedAt: '22/09/2026 08:00',
      initialFloat: 600.00,
      cashInSales: 3120.00,
      pixSales: 6410.00,
      tefSales: 8940.00,
      sangrias: 1500.00,
      suprimentos: 0.00,
      currentBalance: 11070.00
    },
    {
      id: 'CX-03',
      name: 'Caixa 03 - Vendas Corporativas B2B',
      operator: 'Rodrigo Martins',
      status: 'fechado',
      openedAt: '21/09/2026 08:00',
      closedAt: '21/09/2026 18:30',
      initialFloat: 0.00,
      currentBalance: 0.00
    }
  ],

  cashMovements: [
    { id: 'MOV-01', type: 'suprimento', caixa: 'Caixa 02', value: 600.00, reason: 'Abertura de Caixa (Fundo Inicial)', time: '08:00', operator: 'Juliana Silva' },
    { id: 'MOV-02', type: 'venda', caixa: 'Caixa 02', value: 382.50, reason: 'Venda NFC-e nº 000.084.219', time: '13:12', operator: 'Juliana Silva' },
    { id: 'MOV-03', type: 'sangria', caixa: 'Caixa 02', value: 1500.00, reason: 'Sangria de Segurança para Cofre', time: '12:00', operator: 'Juliana Silva' },
    { id: 'MOV-04', type: 'suprimento', caixa: 'Caixa 01', value: 200.00, reason: 'Troco miúdo moedas/cédulas', time: '10:30', operator: 'Lucas Toledo' }
  ],

  // Compras & Fornecedores
  suppliers: [
    { id: 'FORN-01', name: 'Ambev Distribuição Brasil Ltda', cnpj: '02.808.708/0001-07', leadTime: '2 dias', paymentTerms: 'Boleto 21 DDL', rating: 'A+' },
    { id: 'FORN-02', name: 'Cervejaria Paulistana Chopp S/A', cnpj: '14.992.112/0001-88', leadTime: '1 dia', paymentTerms: 'Boleto 14 DDL', rating: 'A' },
    { id: 'FORN-03', name: 'Diageo Brasil Bebidas Premium', cnpj: '00.329.847/0001-90', leadTime: '4 dias', paymentTerms: 'Boleto 28 DDL', rating: 'A+' },
    { id: 'FORN-04', name: 'Coca-Cola FEMSA Distribuidora', cnpj: '45.992.302/0001-44', leadTime: '2 dias', paymentTerms: 'Boleto 15 DDL', rating: 'A' }
  ],

  purchaseSuggestions: [
    {
      productId: 'PROD-002',
      productName: 'Chopp IPA Artesanal Barril 30L Inox',
      supplier: 'Cervejaria Paulistana Chopp S/A',
      currentStock: 12,
      minStock: 15,
      suggestedQty: 25,
      unitCost: 210.00,
      totalCost: 5250.00,
      urgency: 'alta', // 'alta' | 'media' | 'baixa'
      reason: 'Estoque abaixo do mínimo de segurança (12 / 15)'
    },
    {
      productId: 'PROD-005',
      productName: 'Whisky 12 Anos Reserva Escocês 1L',
      supplier: 'Diageo Brasil Bebidas Premium',
      currentStock: 64,
      minStock: 20,
      suggestedQty: 40,
      unitCost: 135.00,
      totalCost: 5400.00,
      urgency: 'media',
      reason: 'Previsão de alta demanda para o final de semana'
    },
    {
      productId: 'PROD-011',
      productName: 'Gelo Filtrado em Cubos Pacote 10kg',
      supplier: 'Gelo Polar Ltda',
      currentStock: 150,
      minStock: 50,
      suggestedQty: 100,
      unitCost: 8.50,
      totalCost: 850.00,
      urgency: 'media',
      reason: 'Reposição semanal de câmara fria'
    }
  ],

  // Fiscal: Conciliação Tributária e Notas
  fiscalReconciliationData: [
    { doc: 'NF-e 000.084.218', recipient: 'Boteco Vila Madalena', sefazStatus: 'Autorizada', bankStatus: 'Boleto Emitido', diff: 'R$ 0,00', status: 'Conciliada' },
    { doc: 'NF-e 000.084.217', recipient: 'Rede Esperança Matriz', sefazStatus: 'Processando', bankStatus: 'Pendente', diff: 'R$ 0,00', status: 'Aguardando Sefaz' },
    { doc: 'NFC-e 000.084.219', recipient: 'Consumidor Final', sefazStatus: 'Autorizada', bankStatus: 'PIX/TEF Conciliado', diff: 'R$ 0,00', status: 'Conciliada' },
    { doc: 'NFC-e 000.084.216', recipient: 'Consumidor Balcão', sefazStatus: 'Rejeitada', bankStatus: 'TEF Aprovado', diff: 'R$ 234,90', status: 'Divergência Fiscal' }
  ],

  // Usuários do Sistema & Matriz de Permissões
  systemUsers: [
    { id: 'USR-01', name: 'Roberto Silveira', login: 'roberto.gerente', role: 'Gerente Geral / Admin', branch: 'Matriz São Paulo', status: 'ativo', lastAccess: '22/09/2026 13:40' },
    { id: 'USR-02', name: 'Rodrigo Martins', login: 'rodrigo.vendas', role: 'Executivo Comercial B2B', branch: 'Matriz São Paulo', status: 'ativo', lastAccess: '22/09/2026 13:35' },
    { id: 'USR-03', name: 'Juliana Silva', login: 'juliana.caixa', role: 'Operadora de Caixa PDV', branch: 'Matriz São Paulo', status: 'ativo', lastAccess: '22/09/2026 13:12' },
    { id: 'USR-04', name: 'Lucas Toledo', login: 'lucas.caixa', role: 'Operador de Caixa PDV', branch: 'Matriz São Paulo', status: 'ativo', lastAccess: '22/09/2026 12:45' },
    { id: 'USR-05', name: 'Marcos Almoxarife', login: 'marcos.estoque', role: 'Supervisor de Logística & Estoque', branch: 'Galpão Central', status: 'ativo', lastAccess: '22/09/2026 11:20' }
  ],

  systemPermissions: [
    { role: 'Gerente Geral / Admin', vendasPDV: true, vendasB2B: true, orcamentos: true, fiscalEmitir: true, fiscalCancelar: true, caixaAbrirFechar: true, caixaSangria: true, estoqueCadastro: true, estoqueLote: true, compras: true, relatorios: true, financeiro: true, admin: true },
    { role: 'Executivo Comercial B2B', vendasPDV: false, vendasB2B: true, orcamentos: true, fiscalEmitir: true, fiscalCancelar: false, caixaAbrirFechar: false, caixaSangria: false, estoqueCadastro: false, estoqueLote: false, compras: false, relatorios: true, financeiro: false, admin: false },
    { role: 'Operador de Caixa PDV', vendasPDV: true, vendasB2B: false, orcamentos: false, fiscalEmitir: true, fiscalCancelar: false, caixaAbrirFechar: true, caixaSangria: false, estoqueCadastro: false, estoqueLote: false, compras: false, relatorios: false, financeiro: false, admin: false },
    { role: 'Supervisor de Estoque', vendasPDV: false, vendasB2B: false, orcamentos: false, fiscalEmitir: false, fiscalCancelar: false, caixaAbrirFechar: false, caixaSangria: false, estoqueCadastro: true, estoqueLote: true, compras: true, relatorios: true, financeiro: false, admin: false }
  ],

  // Relatórios DRE e Consolidação Financeira
  dreSummary: {
    receitaBruta: 684500.00,
    deducoesTributos: 75295.00, // ICMS / PIS / COFINS
    receitaLiquida: 609205.00,
    custoMercadorias: 398200.00, // CMV
    lucroBruto: 211005.00,
    margemBruta: '34.6%',
    despesasOperacionais: 68400.00, // Logística, Energia, Pessoal
    ebitda: 142605.00,
    margemEbitda: '23.4%',
    despesasFinanceiras: 8400.00,
    lucroLiquido: 134205.00,
    margemLiquida: '22.0%'
  },

  // Financeiro (Contas a Pagar / Receber / Boletos)
  financialBillsToPay: [
    { id: 'PAG-01', description: 'Ambev - Compra de Cervejas e Packs', supplier: 'Ambev Distribuição S/A', dueDate: '25/09/2026', value: 24500.00, status: 'aberto', category: 'Fornecedores' },
    { id: 'PAG-02', description: 'Paulistana - Lote Barris Chopp 50L/30L', supplier: 'Cervejaria Paulistana S/A', dueDate: '28/09/2026', value: 12600.00, status: 'aberto', category: 'Fornecedores' },
    { id: 'PAG-03', description: 'Energia Elétrica Câmaras Frias (Enel)', supplier: 'Enel SP Distribuição', dueDate: '30/09/2026', value: 4820.00, status: 'aberto', category: 'Utilidades / Energia' },
    { id: 'PAG-04', description: 'Diageo - Destilados Importados Lote 88', supplier: 'Diageo Brasil Bebidas', dueDate: '15/09/2026', value: 18400.00, status: 'pago', category: 'Fornecedores' }
  ],

  financialBillsToReceive: [
    { id: 'REC-01', client: 'Rede Esperança Matriz', nfe: '000.084.217', dueDate: '03/10/2026', value: 14200.00, status: 'aberto', form: 'Boleto Bancário', bank: 'Banco Itaú' },
    { id: 'REC-02', client: 'Boteco Vila Madalena', nfe: '000.084.218', dueDate: '30/09/2026', value: 4890.00, status: 'aberto', form: 'Faturado 15/30D', bank: 'Banco do Brasil' },
    { id: 'REC-03', client: 'Espetaria Prime Show', nfe: '000.083.890', dueDate: '15/09/2026', value: 6240.00, status: 'pago', form: 'PIX no Ato', bank: 'Santander' },
    { id: 'REC-04', client: 'Rede Esperança Matriz', nfe: '000.083.712', dueDate: '10/09/2026', value: 22800.00, status: 'pago', form: 'Boleto Bancário', bank: 'Banco Itaú' }
  ],

  financialBankBoletos: [
    { id: 'BOL-9841', ourNumber: '09/842109-1', client: 'Rede Esperança Matriz', value: 14200.00, emissionDate: '12/09/2026', dueDate: '03/10/2026', bank: 'Itaú Unibanco', status: 'Registrado / A Vencer', barcode: '34191.79001 01043.510047 91020.150008 3 98450001420000' },
    { id: 'BOL-9840', ourNumber: '09/842108-3', client: 'Boteco Vila Madalena', value: 4890.00, emissionDate: '15/09/2026', dueDate: '30/09/2026', bank: 'Banco do Brasil', status: 'Registrado / A Vencer', barcode: '00190.00009 01842.108301 98420.150008 1 98450000489000' },
    { id: 'BOL-9838', ourNumber: '09/842106-7', client: 'Rede Esperança Matriz', value: 22800.00, emissionDate: '25/08/2026', dueDate: '10/09/2026', bank: 'Itaú Unibanco', status: 'Liquidado / Pago', barcode: '34191.79001 01043.510047 91020.150008 3 98450002280000' }
  ],

  fiscalInvoices: [
    {
      id: 'NF-01',
      nfeNumber: '000.084.219',
      serie: '1',
      date: '22/09/2026 13:12:45',
      type: 'NFC-e Mod 65',
      customer: 'Consumidor Final (CPF ***.491.028-**)',
      customerType: 'b2c',
      itemsCount: 4,
      totalAmount: 382.50,
      paymentMethod: 'Split (PIX + TEF)',
      status: 'autorizada',
      statusText: 'Autorizada',
      protocol: '135260922894101',
      xmlKey: '35260918342981000144550010000842191084219123',
      operator: 'Juliana Silva (PDV-02)',
      isCancellable: true,
      items: [
        { name: 'Cerveja Puro Malte Lata 350ml Pack c/ 12', qty: 4, unitPrice: 46.80, total: 187.20 },
        { name: 'Whisky 12 Anos Reserva 1L', qty: 1, unitPrice: 189.90, total: 189.90 },
        { name: 'Gelo Filtrado Pacote 10kg', qty: 1, unitPrice: 22.00, total: 22.00 }
      ]
    },
    {
      id: 'NF-02',
      nfeNumber: '000.084.218',
      serie: '1',
      date: '22/09/2026 12:48:10',
      type: 'NF-e Mod 55',
      customer: 'Boteco Vila Madalena Ltda',
      customerType: 'b2b',
      itemsCount: 23,
      totalAmount: 4890.00,
      paymentMethod: 'Faturado 15/30D',
      status: 'autorizada',
      statusText: 'Autorizada',
      protocol: '135260922893872',
      xmlKey: '35260918342981000144550010000842181084218144',
      operator: 'Rodrigo Martins (B2B Central)',
      isCancellable: true,
      items: [
        { name: 'Chopp Pilsen Barril 50L Inox', qty: 6, unitPrice: 420.00, total: 2520.00 },
        { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 15, unitPrice: 138.00, total: 2070.00 },
        { name: 'Gelo Filtrado Pacote 10kg', qty: 12, unitPrice: 22.00, total: 264.00 }
      ]
    },
    {
      id: 'NF-03',
      nfeNumber: '000.084.217',
      serie: '1',
      date: '22/09/2026 12:30:04',
      type: 'NF-e Mod 55',
      customer: 'Rede Esperança Matriz',
      customerType: 'b2b',
      itemsCount: 112,
      totalAmount: 14200.00,
      paymentMethod: 'Boleto Bancário',
      status: 'processando',
      statusText: 'Transmitindo Lote',
      protocol: 'Em Fila Sefaz',
      xmlKey: '35260904912441000218550010000842171084217199',
      operator: 'Rodrigo Martins (B2B Central)',
      isCancellable: false
    },
    {
      id: 'NF-04',
      nfeNumber: '000.084.216',
      serie: '1',
      date: '22/09/2026 11:15:22',
      type: 'NFC-e Mod 65',
      customer: 'Marcos Vinícius (Consumidor)',
      customerType: 'b2c',
      itemsCount: 2,
      totalAmount: 234.90,
      paymentMethod: 'TEF Crédito 1x',
      status: 'rejeitada',
      statusText: 'Rejeitada (Erro 704)',
      protocol: 'Rejeição Sefaz',
      xmlKey: '35260932651109000190650010000842161084216101',
      operator: 'Lucas Toledo (PDV-01)',
      isCancellable: true
    },
    {
      id: 'NF-05',
      nfeNumber: '000.084.215',
      serie: '1',
      date: '22/09/2026 10:05:39',
      type: 'NFC-e Mod 65',
      customer: 'Consumidor Balcão',
      customerType: 'b2c',
      itemsCount: 6,
      totalAmount: 512.00,
      paymentMethod: 'Dinheiro',
      status: 'autorizada',
      statusText: 'Autorizada',
      protocol: '135260922891004',
      xmlKey: '35260918342981000144550010000842151084215177',
      operator: 'Juliana Silva (PDV-02)',
      isCancellable: true
    }
  ],

  reportsSummary: {
    kpis: {
      dailyRevenue: 48930.50,
      dailyRevenueChange: '+14.8%',
      avgTicket: 342.17,
      avgTicketChange: '+6.2%',
      b2bShare: '68.4%',
      b2cShare: '31.6%',
      defaultRate: 2.1,
      defaultRateStatus: 'Zona Saudável (< 3%)',
      cascosInCirculation: 2450,
      returnRate: '94.2%'
    },
    detailedSales: [
      {
        saleId: 'VND-20260922-0941',
        timestamp: '22/09/2026 13:12:45',
        type: 'b2c',
        client: 'Consumidor Final (CPF ***.491.028-**)',
        grossTotal: 410.00,
        discountApplied: 27.50,
        discountPercentage: '6.7%',
        netTotal: 382.50,
        operator: 'Juliana Silva (PDV-02)',
        channel: 'Frente de Caixa (Balcão)',
        payments: [
          { method: 'PIX Dinâmico QR Code', value: 200.00, authCode: 'PIX-E2E-9842109841' },
          { method: 'Cartão de Débito (TEF PinPad)', value: 182.50, authCode: 'TEF-NSU-048291 / Rede Cielo' }
        ],
        items: [
          { name: 'Cerveja Puro Malte Lata 350ml Pack c/ 12', qty: 4, unitPrice: 46.80, total: 187.20, discount: 10.00 },
          { name: 'Whisky 12 Anos Reserva 1L', qty: 1, unitPrice: 189.90, total: 189.90, discount: 17.50 },
          { name: 'Gelo Filtrado Pacote 10kg', qty: 1, unitPrice: 22.00, total: 22.00, discount: 0.00 }
        ],
        nfeInfo: {
          key: '35260918342981000144550010000842191084219123',
          protocol: '135260922894101',
          cfop: '5.102 / 5.405 (Subst. Tributária)',
          taxEstimated: 'R$ 72,14 (IBPT 18,86%)'
        }
      },
      {
        saleId: 'VND-20260922-0890',
        timestamp: '22/09/2026 12:48:10',
        type: 'b2b',
        client: 'Boteco Vila Madalena Ltda (CNPJ 18.342.981/0001-44)',
        grossTotal: 5100.00,
        discountApplied: 210.00,
        discountPercentage: '4.1%',
        netTotal: 4890.00,
        operator: 'Rodrigo Martins (Comercial B2B)',
        channel: 'Portal B2B & Rota Expresso',
        payments: [
          { method: 'Faturado Prazo 15/30 DDL', value: 4890.00, authCode: 'DUP-001/002 - Banco Itaú' }
        ],
        vasilhamesTrade: {
          entreguesDevidos: '6x Barril 50L + 15x Cx 600ml',
          devolvidosAto: '6x Barril 50L + 15x Cx 600ml',
          saldoFinal: 'Zerado no ato da entrega'
        },
        items: [
          { name: 'Chopp Pilsen Barril 50L Inox', qty: 6, unitPrice: 420.00, total: 2520.00, discount: 120.00 },
          { name: 'Cerveja Lager 600ml Cx c/ 24', qty: 15, unitPrice: 138.00, total: 2070.00, discount: 90.00 },
          { name: 'Gelo Filtrado Pacote 10kg', qty: 12, unitPrice: 22.00, total: 264.00, discount: 0.00 }
        ],
        nfeInfo: {
          key: '35260918342981000144550010000842181084218144',
          protocol: '135260922893872',
          cfop: '5.101 / 5.403 (ICMS-ST Retido)',
          taxEstimated: 'R$ 1.124,70 (Destacado NF-e)'
        }
      }
    ],
    supplierInvoices: [
      {
        id: 'NF-AMB-89421',
        supplier: 'Ambev Distribuição S/A',
        cnpj: '02.286.460/0001-42',
        invoiceNumber: '000.089.421',
        series: '1',
        issueDate: '21/09/2026',
        totalValue: 18450.00,
        accessKey: '35260902286460000142550010000894211098421094',
        status: 'Recebida / Pronta para Entrada',
        items: [
          {
            name: 'Cerveja Lager 600ml Caixa c/ 24 Garrafas',
            sku: 'CER-600-CX24',
            category: 'cervejas',
            type: 'mixed',
            qty: 120,
            unitCost: 92.00,
            suggestedPdvPrice: 138.00,
            suggestedB2bPrice: 128.00,
            ncm: '2203.00.00',
            cest: '03.002.00',
            cfop: '1.403 / 5.405',
            cst: '060 - ICMS Cobrado por Substituição',
            pisCofins: 'Alíquota Zero / Monofásico',
            barcode: '789123456003',
            location: 'Galpão Principal - R2',
            isReturnable: true,
            vasilhameType: 'Caixa 24x 600ml c/ Vasilhame'
          },
          {
            name: 'Cerveja Puro Malte Lata 350ml Pack c/ 12',
            sku: 'CER-LAT-PK12',
            category: 'cervejas',
            type: 'b2c',
            qty: 180,
            unitCost: 32.00,
            suggestedPdvPrice: 46.80,
            suggestedB2bPrice: 41.50,
            ncm: '2203.00.00',
            cest: '03.003.00',
            cfop: '1.102 / 5.102',
            cst: '000 - Tributada Integralmente',
            pisCofins: 'Alíquota Zero / Monofásico',
            barcode: '789123456004',
            location: 'Galpão Principal - R1',
            isReturnable: false,
            vasilhameType: 'Nenhum'
          }
        ]
      },
      {
        id: 'NF-HEIN-45210',
        supplier: 'Heineken Brasil Indústria de Bebidas Ltda',
        cnpj: '03.376.570/0001-85',
        invoiceNumber: '000.045.210',
        series: '2',
        issueDate: '22/09/2026',
        totalValue: 24800.00,
        accessKey: '35260903376570000185550020000452101076541298',
        status: 'Recebida / Pronta para Entrada',
        items: [
          {
            name: 'Chopp Pilsen Barril 50L Inox',
            sku: 'CHP-PIL-50L',
            category: 'barris',
            type: 'b2b',
            qty: 50,
            unitCost: 260.00,
            suggestedPdvPrice: 420.00,
            suggestedB2bPrice: 395.00,
            ncm: '2203.00.00',
            cest: '03.001.00',
            cfop: '1.403 / 5.405',
            cst: '010 - Tributada com Cobrança de ICMS-ST',
            pisCofins: 'Monofásico 1,86% + 8,54%',
            barcode: '789123456001',
            location: 'Câmara Fria A1',
            isReturnable: true,
            vasilhameType: 'Barril 50L Inox'
          },
          {
            name: 'Cerveja Premium Lager Long Neck 330ml Cx c/ 24',
            sku: 'CER-LN-CX24',
            category: 'cervejas',
            type: 'mixed',
            qty: 100,
            unitCost: 118.00,
            suggestedPdvPrice: 175.00,
            suggestedB2bPrice: 159.00,
            ncm: '2203.00.00',
            cest: '03.002.00',
            cfop: '1.403 / 5.405',
            cst: '060 - Cobrado por ST',
            pisCofins: 'Monofásico',
            barcode: '789123456015',
            location: 'Galpão Principal - R2',
            isReturnable: false,
            vasilhameType: 'Nenhum'
          }
        ]
      },
      {
        id: 'NF-COCA-91823',
        supplier: 'Coca-Cola FEMSA Brasil',
        cnpj: '61.909.569/0001-88',
        invoiceNumber: '000.091.823',
        series: '1',
        issueDate: '20/09/2026',
        totalValue: 12340.00,
        accessKey: '35260961909569000188550010000918231089234109',
        status: 'Recebida / Pronta para Entrada',
        items: [
          {
            name: 'Refrigerante Cola 2L Fardo c/ 6 Unidades',
            sku: 'REF-COL-FD6',
            category: 'nao-alcoolicos',
            type: 'mixed',
            qty: 250,
            unitCost: 34.50,
            suggestedPdvPrice: 48.00,
            suggestedB2bPrice: 42.00,
            ncm: '2202.10.00',
            cest: '03.021.00',
            cfop: '1.403 / 5.405',
            cst: '060 - ICMS ST',
            pisCofins: 'Monofásico Bebidas Frias',
            barcode: '789123456009',
            location: 'Galpão Principal - R4',
            isReturnable: false,
            vasilhameType: 'Nenhum'
          },
          {
            name: 'Água Mineral c/ Gás 500ml Fardo c/ 12',
            sku: 'AGU-GAS-FD12',
            category: 'nao-alcoolicos',
            type: 'mixed',
            qty: 150,
            unitCost: 14.00,
            suggestedPdvPrice: 26.40,
            suggestedB2bPrice: 22.00,
            ncm: '2201.10.00',
            cest: '03.022.00',
            cfop: '1.102 / 5.102',
            cst: '000 - Tributada',
            pisCofins: 'Alíquota 0,65% + 3,00%',
            barcode: '789123456010',
            location: 'Galpão Principal - R5',
            isReturnable: false,
            vasilhameType: 'Nenhum'
          }
        ]
      }
    ],
    payableTitles: [
      {
        id: 'TIT-2026-001',
        titleNumber: 'DUP-089421/01',
        invoiceRef: 'NF-e 000.089.421',
        supplier: 'Ambev Distribuição S/A',
        cnpj: '02.286.460/0001-42',
        issueDate: '21/09/2026',
        dueDate: '25/09/2026',
        amount: 9225.00,
        paidAmount: 0.00,
        status: 'aberto',
        barcode: '23793.38128 60000.123456 78000.089421 1 98450000922500',
        nfeKey: '35260902286460000142550010000894211098421094',
        category: 'Compra de Mercadoria p/ Revenda'
      },
      {
        id: 'TIT-2026-002',
        titleNumber: 'DUP-089421/02',
        invoiceRef: 'NF-e 000.089.421',
        supplier: 'Ambev Distribuição S/A',
        cnpj: '02.286.460/0001-42',
        issueDate: '21/09/2026',
        dueDate: '10/10/2026',
        amount: 9225.00,
        paidAmount: 0.00,
        status: 'aberto',
        barcode: '23793.38128 60000.123457 78000.089422 2 98450000922500',
        nfeKey: '35260902286460000142550010000894211098421094',
        category: 'Compra de Mercadoria p/ Revenda'
      },
      {
        id: 'TIT-2026-003',
        titleNumber: 'DUP-045210/01',
        invoiceRef: 'NF-e 000.045.210',
        supplier: 'Heineken Brasil Indústria Ltda',
        cnpj: '03.376.570/0001-85',
        issueDate: '22/09/2026',
        dueDate: '23/09/2026',
        amount: 12400.00,
        paidAmount: 12400.00,
        status: 'pago',
        barcode: '34191.09482 12384.910283 48102.045210 3 98450001240000',
        nfeKey: '35260903376570000185550020000452101076541298',
        category: 'Compra de Barris e Insumos'
      },
      {
        id: 'TIT-2026-004',
        titleNumber: 'DUP-091823/01',
        invoiceRef: 'NF-e 000.091.823',
        supplier: 'Coca-Cola FEMSA Brasil',
        cnpj: '61.909.569/0001-88',
        issueDate: '20/09/2026',
        dueDate: '28/09/2026',
        amount: 12340.00,
        paidAmount: 0.00,
        status: 'aberto',
        barcode: '00190.00009 01823.948210 49182.091823 4 98450001234000',
        nfeKey: '35260961909569000188550010000918231089234109',
        category: 'Refrigerantes e Hidratação'
      },
      {
        id: 'TIT-2026-005',
        titleNumber: 'ENERG-09/2026',
        invoiceRef: 'Conta de Energia CPFL',
        supplier: 'CPFL Paulista Energia',
        cnpj: '02.429.980/0001-40',
        issueDate: '15/09/2026',
        dueDate: '24/09/2026',
        amount: 4380.50,
        paidAmount: 0.00,
        status: 'aberto',
        barcode: '83660.00004 38050.198230 48102.948192 5 98450000438050',
        nfeKey: '35260902429980000140550010004918231094821948',
        category: 'Câmaras Frias & Operação'
      }
    ],
    salesAnalytics: {
      peakHours: [
        { hourRange: '08:00 - 10:00', ordersCount: 45, revenue: 1250.00, avgTicket: 27.77, sharePct: 12 },
        { hourRange: '10:00 - 12:00', ordersCount: 34, revenue: 11420.00, avgTicket: 335.88, sharePct: 21.5 },
        { hourRange: '12:00 - 14:00', ordersCount: 22, revenue: 6980.00, avgTicket: 317.27, sharePct: 13.1 },
        { hourRange: '14:00 - 17:00', ordersCount: 120, revenue: 8400.00, avgTicket: 70.00, sharePct: 48 },
        { hourRange: '17:00 - 20:00', ordersCount: 80, revenue: 4500.00, avgTicket: 56.25, sharePct: 30 }
      ],
      weekdays: [
        { day: 'Sexta', revenue: 45000, sharePct: 35 },
        { day: 'Sábado', revenue: 36000, sharePct: 28 },
        { day: 'Quinta', revenue: 15000, sharePct: 11 }
      ]
    },
    b2bClientProductPurchaseHistory: [
      {
        clientId: 'CLI-PJ-001',
        productId: 'PROD-001',
        productName: 'Chopp Pilsen Barril 50L Inox',
        purchases: [
          { orderId: 'PED-B2B-1084', date: '22/09/2026', qty: 6, unitPrice: 420.00, discount: 20.00, netUnit: 400.00, total: 2400.00, nfe: 'NF 84218', status: 'Entregue' },
          { orderId: 'PED-B2B-1049', date: '15/09/2026', qty: 8, unitPrice: 420.00, discount: 25.00, netUnit: 395.00, total: 3160.00, nfe: 'NF 83912', status: 'Entregue' },
          { orderId: 'PED-B2B-0982', date: '01/09/2026', qty: 10, unitPrice: 420.00, discount: 30.00, netUnit: 390.00, total: 3900.00, nfe: 'NF 83201', status: 'Entregue' }
        ]
      },
      {
        clientId: 'CLI-PJ-001',
        productId: 'PROD-003',
        productName: 'Cerveja Lager 600ml Caixa c/ 24 Garrafas',
        purchases: [
          { orderId: 'PED-B2B-1084', date: '22/09/2026', qty: 15, unitPrice: 138.00, discount: 10.00, netUnit: 128.00, total: 1920.00, nfe: 'NF 84218', status: 'Entregue' },
          { orderId: 'PED-B2B-1049', date: '15/09/2026', qty: 20, unitPrice: 138.00, discount: 12.00, netUnit: 126.00, total: 2520.00, nfe: 'NF 83912', status: 'Entregue' }
        ]
      },
      {
        clientId: 'CLI-PJ-002',
        productId: 'PROD-004',
        productName: 'Cerveja Puro Malte Lata 350ml Pack c/ 12',
        purchases: [
          { orderId: 'PED-B2B-1070', date: '18/09/2026', qty: 40, unitPrice: 46.80, discount: 5.30, netUnit: 41.50, total: 1660.00, nfe: 'NF 84099', status: 'Entregue' }
        ]
      }
    ]
  },
  // Simuladores Faltantes Injetados

  salesAnalytics: {
    peakHours: [
      { hourRange: '08:00 - 10:00', ordersCount: 45, revenue: 1250.00, avgTicket: 27.77, sharePct: 12 },
      { hourRange: '14:00 - 17:00', ordersCount: 120, revenue: 8400.00, avgTicket: 70.00, sharePct: 48 },
      { hourRange: '17:00 - 20:00', ordersCount: 80, revenue: 4500.00, avgTicket: 56.25, sharePct: 30 }
    ],
    weekdays: [
      { day: 'Sexta', revenue: 45000, sharePct: 35 },
      { day: 'Sábado', revenue: 36000, sharePct: 28 },
      { day: 'Quinta', revenue: 15000, sharePct: 11 }
    ]
  },


  // Fixed arrays
  supplierBudgets: [
    { supplier: 'Ambev S.A.', period: 'Setembro 2026', budgetLimit: 120000.00, spentAmount: 85000.00 },
    { supplier: 'Coca-Cola FEMSA', period: 'Setembro 2026', budgetLimit: 60000.00, spentAmount: 58000.00 },
    { supplier: 'Diageo Brasil', period: 'Setembro 2026', budgetLimit: 40000.00, spentAmount: 12500.00 }
  ],
  priceAnalysisData: [
    { productName: 'Skol Pilsen 350ml', supplier: 'Ambev S.A.', lastPrice: 2.75, currentPrice: 2.80 },
    { productName: 'Heineken LN 330ml', supplier: 'Heineken Brasil', lastPrice: 4.90, currentPrice: 5.10 },
    { productName: 'Catuaba Selvagem 1L', supplier: 'Arbórea', lastPrice: 12.00, currentPrice: 11.50 }
  ],
  fiscalReconciliationData: [
    { id: 'REC-001', nfe: 'NFe 00892', client: 'Distribuidora Central', fiscalValue: 12500.00, financialValue: 12500.00, gateway: 'TEF / Rede', diff: 0, status: 'conciliado' },
    { id: 'REC-002', nfe: 'NFe 00893', client: 'Mercado da Esquina', fiscalValue: 840.50, financialValue: 800.00, gateway: 'PIX Itau', diff: -40.50, status: 'aberto' }
  ],
  stockKardex: [
    { id: 'KDX-101', date: '23/09/2026 14:30', productName: 'Cerveja Skol Litro', type: 'saida', documentRef: 'NFC-e 9912', qtyMoved: 2, priorStock: 150, newStock: 148, location: 'Câmara Fria A1', operator: 'João Silva' },
    { id: 'KDX-102', date: '23/09/2026 10:15', productName: 'Refrigerante Coca-Cola 2L', type: 'entrada', documentRef: 'NF-e 88123', qtyMoved: 50, priorStock: 200, newStock: 250, location: 'Galpão Principal', operator: 'Admin' }
  ],

  cashSessionsHistory: [
    { id: '#CX-001', terminal: 'Caixa 01 (Balcão)', operator: 'João Silva', date: '23/09/2026', openedAt: '08:00', closedAt: '16:00', openingBalance: 150.00, grossTotal: 1250.00, difference: 0, auditStatus: 'aprovado' },
    { id: '#CX-002', terminal: 'Caixa 02 (Reserva)', operator: 'Maria Souza', date: '22/09/2026', openedAt: '14:00', closedAt: '22:00', openingBalance: 200.00, grossTotal: 3450.50, difference: -12.50, auditStatus: 'analise' }
  ],
  
  purchaseSuggestions: [
    { productId: 'PROD-001', product: 'Skol Pilsen Lata 350ml', reason: 'Estoque Crítico (2 un)', supplierA: 'Ambev', priceA: 2.80, supplierB: 'Atacadão', priceB: 2.95 },
    { productId: 'PROD-002', product: 'Coca-Cola 2L', reason: 'Alto Giro (50/dia)', supplierA: 'Ambev', priceA: 8.10, supplierB: 'Atacadão', priceB: 7.90 }
  ]
};
