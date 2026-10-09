// Base de Dados Corporativa Completa - ERP Distribuidora de Bebidas
const initialData = {
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
      name: 'Cerveja Lager 600ml Caixa c/ 24 Garrafas',
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
      name: 'Cerveja Puro Malte Lata 350ml Pack c/ 12',
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
