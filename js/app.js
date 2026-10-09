// ==========================================================================
// DISTRIBUIDORA DE BEBIDAS - ERP & PDV ENTERPRISE ACCORDION CORE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // App State - Carrega todas as coleções do banco de dados simulado
  const state = {
    currentView: 'view-dashboard-geral',
    products: [...initialData.products],
    b2bClients: [...initialData.b2bClients],
    fiscalInvoices: [...initialData.fiscalInvoices],
    quotes: [...(initialData.quotes || [])],
    cashRegisters: [...(initialData.cashRegisters || [])],
    cashSessionsHistory: [...(initialData.cashSessionsHistory || [])],
    cashMovements: [...(initialData.cashMovements || [])],
    stockKardex: [...(initialData.stockKardex || [])],
    stockTransfers: [...(initialData.stockTransfers || [])],
    supplierBudgets: [...(initialData.supplierBudgets || [])],
    priceAnalysisData: [...(initialData.priceAnalysisData || [])],
    purchaseSuggestions: [...(initialData.purchaseSuggestions || [])],
    fiscalReconciliationData: [...(initialData.fiscalReconciliationData || [])],
    systemUsers: [...(initialData.systemUsers || [])],
    systemPermissions: [...(initialData.systemPermissions || [])],
    dreSummary: JSON.parse(JSON.stringify(initialData.dreSummary || {})),
    financialBillsToPay: [...(initialData.financialBillsToPay || [])],
    financialBillsToReceive: [...(initialData.financialBillsToReceive || [])],
    financialBankBoletos: [...(initialData.financialBankBoletos || [])],
    reportsData: JSON.parse(JSON.stringify(initialData.reportsSummary)),
    supplierInvoices: [...(initialData.supplierInvoices || [])],
    payableTitles: [...(initialData.payableTitles || [])],
    salesAnalytics: JSON.parse(JSON.stringify(initialData.salesAnalytics || {})),
    b2bClientProductPurchaseHistory: [...(initialData.b2bClientProductPurchaseHistory || [])],
    openedReports: ['vendas_categoria', 'compras_vs_vendas', 'lucro_margens', 'posicao_vasilhames'],
    loteSelectedCategory: 'all',
    
    // Clientes PJ State
    selectedClientPJId: 'CLI-001',
    clientsFilterQuery: '',

    // PDV State
    selectedCategory: 'all',
    searchQuery: '',
    catalogSearchQuery: '',
    catalogSortBy: 'name-asc',
    catalogSelectedCategory: 'all',
    cart: [
      {
        product: initialData.products[2], // Cerveja Lager 600ml
        quantity: 2,
        discountType: 'percentage',
        discountValue: 0
      },
      {
        product: initialData.products[3], // Lata Puro Malte
        quantity: 3,
        discountType: 'percentage',
        discountValue: 10 // 10%
      }
    ],
    orderDiscount: {
      type: 'value',
      value: 0
    },

    // Modal Discount Temp State
    discountModalTarget: {
      mode: 'item',
      itemIndex: null,
      type: 'percentage',
      value: 0
    },

    // B2B Pedidos State
    selectedB2BClientId: 'CLI-001',
    b2bOrderCart: [
      { product: initialData.products[0], quantity: 6, unitPrice: 395.00, discountType: 'percentage', discountValue: 0, packageUnit: 'Barril 50L Inox' },
      { product: initialData.products[2], quantity: 15, unitPrice: 128.00, discountType: 'percentage', discountValue: 0, packageUnit: 'Caixa c/ 24 un (Palete: 45 cx)' },
      { product: initialData.products[10], quantity: 12, unitPrice: 18.00, discountType: 'percentage', discountValue: 0, packageUnit: 'Fardo c/ 5 Pacotes (50kg)' }
    ],
    b2bOrderDiscount: {
      type: 'percent',
      value: 0
    },

    // Fiscal State
    selectedFiscalInvoiceForCancel: null,
    cancelStrategySelected: 'note-only',

    // Estoque Lote Selection
    selectedLoteProductIds: []
  };

  // Helper Formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  // Toast Notification System
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '✕';

    toast.innerHTML = `<span style="font-weight:700;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  };

  window.showToast = showToast;

  window.filterSelect = (inputId, selectId) => {
    const input = document.getElementById(inputId);
    const select = document.getElementById(selectId);
    if (!input || !select) return;
    const term = input.value.toLowerCase();
    Array.from(select.options).forEach(opt => {
      const match = opt.text.toLowerCase().includes(term);
      opt.style.display = match ? 'block' : 'none';
      opt.hidden = !match;
    });
    // Auto-select first visible option if any
    const firstVisible = Array.from(select.options).find(o => !o.hidden);
    if (firstVisible) select.value = firstVisible.value;
  };

  // =========================================================================
  // SISTEMA DE NAVEGAÇÃO ACCORDION SANFONA
  // =========================================================================
  const initMobileSidebar = () => {
    const btnMobile = document.getElementById('btn-mobile-menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (btnMobile && sidebar && overlay) {
      btnMobile.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  };

  const closeMobileSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  };

  const initAccordionNavigation = () => {
    const groupHeaders = document.querySelectorAll('.nav-group-header');
    const subItems = document.querySelectorAll('.nav-subitem');

    groupHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const group = header.closest('.nav-accordion-group');
        const isOpen = group.classList.contains('open');

        document.querySelectorAll('.nav-accordion-group').forEach(g => {
          if (g !== group) g.classList.remove('open');
        });

        if (isOpen) {
          group.classList.remove('open');
        } else {
          group.classList.add('open');
        }
      });
    });

    subItems.forEach(sub => {
      sub.addEventListener('click', () => {
        subItems.forEach(s => s.classList.remove('active'));
        sub.classList.add('active');

        const viewTarget = sub.getAttribute('data-view');
        handleSubmenuNavigation(viewTarget, sub.textContent.trim());
        closeMobileSidebar();
      });
    });
  };

  const handleSubmenuNavigation = (viewTarget, subItemLabel) => {
    const headerTitle = document.getElementById('header-view-title');
    const headerTag = document.getElementById('header-view-tag');

    // Alterna view containers
    const allViews = document.querySelectorAll('.view-container');
    let viewFound = false;
    allViews.forEach(v => {
      if (v.id === viewTarget) {
        v.classList.add('active');
        viewFound = true;
      } else {
        v.classList.remove('active');
      }
    });

    if (!viewFound) {
      console.warn(`View target ${viewTarget} not found in DOM.`);
      return;
    }

    state.currentView = viewTarget;

    // Roteamento Dedicado para Cada Aba
    switch (viewTarget) {
      // 0. DASHBOARD GERAL
      case 'view-dashboard-geral':
        headerTitle.textContent = 'Dashboard • Visão Geral & Inteligência da Distribuidora';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Visão Executiva em Tempo Real';
        renderDashboardGeralView();
        break;

      // 1. CLIENTE
      case 'view-cliente-cadastro':
        headerTitle.textContent = 'Cliente • Cadastro de Nova Empresa (PJ)';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Módulo Cadastral';
        renderClienteCadastroView();
        break;

      case 'view-cliente-consulta':
        headerTitle.textContent = 'Cliente • Consulta & Ficha Cadastral 360°';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Módulo Comercial';
        renderClientsModule();
        break;

      // 2. VENDAS
      case 'view-vendas-varejo':
        headerTitle.textContent = 'Vendas • Varejo (PDV Frente de Caixa)';
        headerTag.className = 'tag-badge tag-b2c';
        headerTag.textContent = 'Frente de Caixa • Terminal 02';
        renderPDVCart();
        break;

      case 'view-vendas-atacado':
        headerTitle.textContent = 'Vendas • Atacado (B2B Corporativo & Faturamento)';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Faturamento & Vasilhames';
        renderB2BOrdersView();
        break;

      case 'view-vendas-orcamento':
        headerTitle.textContent = 'Vendas • Gestão de Orçamentos & Cotações';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Propostas Comerciais';
        renderOrcamentosGrid();
        break;

      // 3. FISCAL
      case 'view-fiscal-geradas':
        headerTitle.textContent = 'Fiscal • Notas Geradas & Monitor Sefaz';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'NFC-e / NF-e em Tempo Real';
        renderFiscalGrid('all');
        break;

      case 'view-fiscal-pendentes':
        headerTitle.textContent = 'Fiscal • Notas Pendentes, Contingência & Rejeições';
        headerTag.className = 'tag-badge tag-b2c';
        headerTag.textContent = 'Fila de Transmissão Sefaz';
        renderFiscalPendentesGrid();
        break;

      case 'view-fiscal-conciliacao':
        headerTitle.textContent = 'Fiscal • Conciliação Fiscal vs Títulos & TEF/PIX';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Auditoria & Cruzamento';
        renderFiscalConciliacaoGrid();
        break;

      // 4. CAIXA
      case 'view-caixa-abertura':
        headerTitle.textContent = 'Caixa • Abertura de Turno & Status dos Terminais';
        headerTag.className = 'tag-badge tag-b2c';
        headerTag.textContent = 'Painel de Terminais PDV';
        renderCaixasAberturaGrid();
        break;

      case 'view-caixa-fechamento':
        headerTitle.textContent = 'Caixa • Fechamento de Turno & Conferência Cega';
        headerTag.className = 'tag-badge tag-b2c';
        headerTag.textContent = 'Terminal 02 • Conferência';
        renderCaixaFechamentoView();
        break;

      case 'view-caixa-movimentacao':
        headerTitle.textContent = 'Caixa • Movimentação, Sangrias & Suprimentos';
        headerTag.className = 'tag-badge tag-b2c';
        headerTag.textContent = 'Lançamentos em Dinheiro';
        renderCaixaMovementsGrid();
        break;

      case 'view-caixa-todos':
        headerTitle.textContent = 'Caixa • Histórico Consolidado de Todos os Caixas';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Auditoria & Sessões';
        renderCaixaTodosGrid();
        break;

      // 5. ESTOQUE
      case 'view-estoque-avulsa':
        headerTitle.textContent = 'Estoque • Entrada & Saída Avulsa (Ajuste Manual)';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Avarias / Brindes / Inventário';
        renderEstoqueAvulsoView();
        break;

      case 'view-estoque-cadastro':
        headerTitle.textContent = 'Estoque • Cadastrar Novo Produto';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Almoxarifado & Catálogo';
        renderEstoqueCadastroForm();
        break;

      case 'view-estoque-historico':
        headerTitle.textContent = 'Estoque • Extrato Analítico Kardex';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Rastreabilidade Completa';
        renderEstoqueHistoricoKardex();
        break;

      case 'view-estoque-todos':
        headerTitle.textContent = 'Estoque • Gestão de Itens & Níveis de Segurança';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Controle Físico & Localização';
        renderEstoqueGrid();
        break;

      case 'view-estoque-lote':
        headerTitle.textContent = 'Estoque • Alterações em Lote & Reajustes em Massa';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Edição Coletiva por Categoria';
        renderEstoqueLoteGrid();
        break;

      case 'view-estoque-minmax':
        headerTitle.textContent = 'Estoque • Níveis Mínimo e Máximo & Ponto de Pedido';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Prevenção de Ruptura';
        renderEstoqueMinMaxGrid();
        break;

      case 'view-estoque-movimentacao':
        headerTitle.textContent = 'Estoque • Movimentação Entre Locais & Câmaras';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Transferência Interna';
        renderEstoqueMovimentacaoView();
        break;

      // 6. COMPRAS
      case 'view-compras-sugestao':
        headerTitle.textContent = 'Compras • Sugestão Automática de Reposição';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Suprimentos & Giro';
        renderComprasSugestaoGrid();
        break;

      case 'view-compras-saida':
        headerTitle.textContent = 'Compras • Análise de Saída por Período & Curva ABC';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Inteligência de Vendas';
        renderComprasSaidaGrid();
        break;

      case 'view-compras-teto':
        headerTitle.textContent = 'Compras • Teto de Compra por Fornecedor (Budget)';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Controle Orçamentário';
        renderComprasTetoGrid();
        break;

      case 'view-compras-precos':
        headerTitle.textContent = 'Compras • Análise Comparativa de Preços de Fábrica';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Cotação & Fornecedores';
        renderComprasPrecosGrid();
        break;

      // 7. RELATÓRIOS
      case 'view-rel-dashboard':
        headerTitle.textContent = 'Relatórios • Painel Dinâmico Multi-Relatórios Lado a Lado';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Cards Dinâmicos em Paralelo';
        renderReportsBoard();
        break;

      case 'view-rel-movimento':
        headerTitle.textContent = 'Relatórios • Movimentação Geral Diária';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Fluxo Físico & Financeiro';
        renderRelMovimentoGrid();
        break;

      case 'view-rel-auditoria':
        headerTitle.textContent = 'Relatórios • Auditoria Fiscal & Cancelamentos';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Compliance Sefaz';
        renderRelAuditoriaGrid();
        break;

      case 'view-rel-vendas':
        headerTitle.textContent = 'Relatórios • Demonstrativo Geral de Vendas';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Controladoria Comercial';
        renderReportsModule();
        break;

      case 'view-rel-compras':
        headerTitle.textContent = 'Relatórios • Histórico Analítico de Compras';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Entradas por Fornecedor';
        renderRelComprasGrid();
        break;

      case 'view-rel-variacao':
        headerTitle.textContent = 'Relatórios • Variação de Preço & Custos de Reposição';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Inflação de Insumos';
        renderRelVariacaoGrid();
        break;

      case 'view-rel-lucro':
        headerTitle.textContent = 'Relatórios • Rentabilidade & Lucro por Produto';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Margem de Contribuição';
        renderRelLucroGrid();
        break;

      case 'view-rel-dre':
        headerTitle.textContent = 'Relatórios • DRE Gerencial & Resultado Operacional';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Demonstrativo Contábil';
        renderRelDREGrid();
        break;

      case 'view-rel-funcionarios':
        headerTitle.textContent = 'Relatórios • Desempenho & Comissões de Vendedores';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Metas & Produtividade';
        renderRelFuncionariosGrid();
        break;

      // 8. FINANCEIRO
      case 'view-fin-vendas':
        headerTitle.textContent = 'Financeiro • Analytics & Inteligência de Vendas';
        headerTag.className = 'tag-badge tag-b2c';
        headerTag.textContent = 'Dados, Picos & Tendências';
        renderFinancialSalesAnalytics();
        break;

      case 'view-fin-pagar':
        headerTitle.textContent = 'Financeiro • Contas a Pagar (Vinculado a Notas de Fornecedores)';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Títulos & Duplicatas';
        renderFinanceiroGrid();
        break;

      case 'view-fin-receber':
        headerTitle.textContent = 'Financeiro • Contas a Receber (Faturamento B2B)';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Crédito & Carteira';
        renderFinancialBillsToReceiveGrid();
        break;

      case 'view-fin-boletos':
        headerTitle.textContent = 'Financeiro • Emissão & Gestão de Boletos Bancários';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Cobrança CNAB 240/400';
        renderFinancialBoletosGrid();
        break;

      case 'view-fin-previsao':
        headerTitle.textContent = 'Financeiro • Previsão de Fluxo de Caixa (30 Dias)';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Liquidez Projetada';
        renderFinancialPrevisaoView();
        break;

      // 9. ADMIN
      case 'view-admin-exportar':
        headerTitle.textContent = 'Admin • Central de Exportação 100% Completa';
        headerTag.className = 'tag-badge tag-b2b';
        headerTag.textContent = 'Excel & PDF Consolidado';
        renderAdminExportView();
        break;

      case 'view-admin-usuarios':
        headerTitle.textContent = 'Admin • Gestão de Usuários & Operadores';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Acesso & Segurança';
        renderAdminUsuariosGrid();
        break;

      case 'view-admin-permissoes':
        headerTitle.textContent = 'Admin • Matriz de Perfis & Permissões';
        headerTag.className = 'tag-badge';
        headerTag.textContent = 'Controle de Acesso RBAC';
        renderAdminPermissoesGrid();
        break;

      default:
        console.log('Navegação padrão para: ' + viewTarget);
        break;
    }
  };

  window.handleSubmenuNavigation = handleSubmenuNavigation;

  // =========================================================================
  // 1. CLIENTES EMPRESAS (PJ)
  // =========================================================================
  const renderClientsModule = () => {
    renderClientsSidebarList();
    renderClientDetailView();
  };

  const renderClientsSidebarList = () => {
    const listContainer = document.getElementById('clients-items-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const filtered = state.b2bClients.filter(c => {
      const q = state.clientsFilterQuery.toLowerCase();
      return c.tradeName.toLowerCase().includes(q) ||
             c.corporateName.toLowerCase().includes(q) ||
             c.cnpj.includes(q);
    });

    filtered.forEach(client => {
      const available = client.creditLimit - client.creditUsed;
      const card = document.createElement('div');
      card.className = `client-item-card ${client.id === state.selectedClientPJId ? 'active' : ''}`;
      card.innerHTML = `
        <div class="client-card-top">
          <div class="client-card-name">${client.tradeName}</div>
          <span class="status-pill ${client.status === 'ativo' ? 'ativo' : 'analise'}">${client.status === 'ativo' ? 'Ativo' : 'Análise'}</span>
        </div>
        <div class="client-card-cnpj">CNPJ: ${client.cnpj}</div>
        <div class="client-card-meta">
          <span>Disp: <strong>${formatCurrency(available)}</strong></span>
          <span>${client.segment}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        state.selectedClientPJId = client.id;
        renderClientsSidebarList();
        renderClientDetailView();
      });

      listContainer.appendChild(card);
    });
  };

  const renderClientDetailView = () => {
    const client = state.b2bClients.find(c => c.id === state.selectedClientPJId) || state.b2bClients[0];
    if (!client) return;

    document.getElementById('client-view-trade-name').textContent = client.tradeName;
    document.getElementById('client-view-corporate-name').textContent = client.corporateName;
    document.getElementById('client-view-cnpj').textContent = client.cnpj;
    document.getElementById('client-view-ie').textContent = client.ie;
    document.getElementById('client-view-since').textContent = client.customerSince || '01/01/2024';

    const statusEl = document.getElementById('client-view-status');
    statusEl.className = `status-pill ${client.status === 'ativo' ? 'ativo' : 'analise'}`;
    statusEl.textContent = client.status === 'ativo' ? 'Ativo' : 'Em Análise';

    const available = client.creditLimit - client.creditUsed;
    document.getElementById('client-view-credit-avail').textContent = formatCurrency(available);
    document.getElementById('client-view-credit-total').textContent = `de ${formatCurrency(client.creditLimit)} total`;
    document.getElementById('client-view-total-purchases').textContent = formatCurrency(client.totalPurchases || 0);
    document.getElementById('client-view-orders-count').textContent = `${client.ordersCount || (client.ordersHistory ? client.ordersHistory.length : 0)} pedidos realizados`;
    document.getElementById('client-view-terms').textContent = client.paymentTerms;

    const totalCascos = (client.cascosBalance?.barril50 || 0) + (client.cascosBalance?.barril30 || 0) + (client.cascosBalance?.caixas600 || 0) + (client.cascosBalance?.caixasLitro || 0);
    document.getElementById('client-view-cascos-posse').textContent = `${totalCascos} unidades`;

    // Aba 1: Histórico de Vendas
    const tbodyOrders = document.getElementById('client-orders-history-tbody');
    tbodyOrders.innerHTML = '';

    if (!client.ordersHistory || client.ordersHistory.length === 0) {
      tbodyOrders.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-dim); padding: 24px;">
            Nenhum histórico de pedidos registrado para esta empresa.
          </td>
        </tr>
      `;
    } else {
      client.ordersHistory.forEach(ord => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong style="font-family:var(--font-mono);">${ord.id}</strong></td>
          <td style="color:var(--text-muted); font-size:11px;">${ord.date}</td>
          <td><span style="font-family:var(--font-mono); font-size:11px;">${ord.nfe}</span></td>
          <td>${ord.itemsCount || (ord.items ? ord.items.length : 0)} un</td>
          <td><strong style="font-family:var(--font-mono);">${formatCurrency(ord.total)}</strong></td>
          <td><span class="status-pill ativo">${ord.status}</span></td>
          <td><span class="status-pill ${ord.paymentStatus?.includes('Pago') ? 'pago' : 'vencer'}">${ord.paymentStatus}</span></td>
          <td style="text-align:right;">
            <div style="display:inline-flex; gap:6px;">
              <button class="btn-secondary btn-view-order-details" style="height:26px; padding:0 8px; font-size:11px;">
                👁️ Detalhes
              </button>
              <button class="btn-secondary btn-view-order-danfe" style="height:26px; padding:0 8px; font-size:11px;">
                📄 DANFE
              </button>
            </div>
          </td>
        `;

        tr.querySelector('.btn-view-order-details').addEventListener('click', () => {
          openOrderDetailsModal(client, ord);
        });

        tr.querySelector('.btn-view-order-danfe').addEventListener('click', () => {
          openDANFEViewer({
            nfeNumber: ord.nfe,
            date: ord.date,
            type: 'NF-e Mod 55',
            customer: client.corporateName,
            totalAmount: ord.total,
            protocol: '13526092894101',
            xmlKey: `35260918342981000144550010000842${ord.nfe.replace(/\D/g, '')}`,
            items: ord.items || []
          });
        });

        tbodyOrders.appendChild(tr);
      });
    }

    // Aba 2: Ficha Cadastral
    document.getElementById('client-info-address').textContent = client.address;
    document.getElementById('client-info-cep').textContent = client.cep || '05416-001 • São Paulo - SP';
    document.getElementById('client-info-segment').textContent = client.segment;
    document.getElementById('client-info-contact').textContent = `${client.contactName} (${client.contactRole || 'Gerente'})`;
    document.getElementById('client-info-phone').textContent = client.phone;
    document.getElementById('client-info-email').textContent = client.email;

    // Aba 3: Vasilhames
    document.getElementById('client-casco-b50').textContent = `${client.cascosBalance?.barril50 || 0} unidades`;
    document.getElementById('client-casco-b30').textContent = `${client.cascosBalance?.barril30 || 0} unidades`;
    document.getElementById('client-casco-cx600').textContent = `${client.cascosBalance?.caixas600 || 0} caixas`;
    document.getElementById('client-casco-litro').textContent = `${client.cascosBalance?.caixasLitro || 0} caixas`;
  };

  const renderClienteCadastroView = () => {
    // Limpa campos do formulário de cadastro de cliente se existir na view
    const cnpjInp = document.getElementById('cad-client-cnpj');
    if (cnpjInp) cnpjInp.focus();
  };

  window.salvarNovoClienteCompleto = () => {
    const cnpj = document.getElementById('cad-client-cnpj')?.value.trim() || document.getElementById('new-client-cnpj')?.value.trim();
    const corpName = document.getElementById('cad-client-corp-name')?.value.trim() || document.getElementById('new-client-corp-name')?.value.trim();
    const tradeName = document.getElementById('cad-client-trade-name')?.value.trim() || document.getElementById('new-client-trade-name')?.value.trim() || corpName;
    const ie = document.getElementById('cad-client-ie')?.value.trim() || document.getElementById('new-client-ie')?.value.trim();
    const segment = document.getElementById('cad-client-segment')?.value || document.getElementById('new-client-segment')?.value || 'Bar & Gastronomia';
    const limit = parseFloat(document.getElementById('cad-client-credit-limit')?.value || document.getElementById('new-client-credit-limit')?.value) || 20000;
    const terms = document.getElementById('cad-client-terms')?.value || document.getElementById('new-client-terms')?.value || 'Faturado 15/30 DDL';
    const contact = document.getElementById('cad-client-contact')?.value.trim() || document.getElementById('new-client-contact')?.value.trim() || 'Gerente';
    const phone = document.getElementById('cad-client-phone')?.value.trim() || document.getElementById('new-client-phone')?.value.trim() || '(11) 99999-0000';
    const email = document.getElementById('cad-client-email')?.value.trim() || document.getElementById('new-client-email')?.value.trim() || 'compras@cliente.com.br';
    const address = document.getElementById('cad-client-address')?.value.trim() || document.getElementById('new-client-address')?.value.trim() || 'Av. Principal, 100';

    if (!cnpj || !corpName) {
      showToast('Preencha ao menos o CNPJ e a Razão Social da empresa.', 'danger');
      return;
    }

    const newClientObj = {
      id: `CLI-${String(state.b2bClients.length + 1).padStart(3, '0')}`,
      cnpj,
      ie: ie || '112.334.556.778',
      corporateName: corpName,
      tradeName,
      segment,
      status: 'ativo',
      creditLimit: limit,
      creditUsed: 0,
      paymentTerms: terms,
      contactName: contact,
      contactRole: 'Responsável',
      phone,
      email,
      address,
      cep: '01000-000',
      customerSince: new Date().toLocaleDateString('pt-BR'),
      totalPurchases: 0,
      ordersCount: 0,
      cascosBalance: { barril50: 0, barril30: 0, caixas600: 0, caixasLitro: 0 },
      ordersHistory: []
    };

    state.b2bClients.unshift(newClientObj);
    state.selectedClientPJId = newClientObj.id;

    const modalNewClient = document.getElementById('modal-new-client');
    if (modalNewClient) modalNewClient.classList.remove('active');

    handleSubmenuNavigation('view-cliente-consulta', '- Consulta');
    showToast(`Empresa ${tradeName} cadastrada com sucesso!`, 'success');
  };

  // =========================================================================
  // 2. ORÇAMENTOS (Visualizador 360 Completo, Ações & Modais)
  // =========================================================================
  const renderOrcamentosGrid = () => {
    const tbody = document.getElementById('orcamentos-grid-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.quotes.forEach(orc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${orc.id}</strong></td>
        <td><strong>${orc.clientName}</strong></td>
        <td>${orc.date}</td>
        <td>${orc.validUntil}</td>
        <td>${orc.seller}</td>
        <td>${orc.itemsCount} un</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(orc.total)}</td>
        <td><span class="status-pill ${orc.status}">${orc.status.toUpperCase()}</span></td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button class="btn-secondary btn-open-quote-360" style="height:26px; padding:0 8px; font-size:11px; font-weight:600; color:var(--primary-navy); border-color:var(--primary-navy-border);">
              👁️ Abrir Orçamento
            </button>
            ${orc.status === 'pendente' ? `
              <button class="btn-secondary btn-quick-approve-orc" style="background-color:var(--status-success-bg); color:var(--status-success); border-color:var(--status-success-border); height:26px; padding:0 8px; font-size:11px;">
                ✓ Venda
              </button>
            ` : ''}
          </div>
        </td>
      `;

      tr.querySelector('.btn-open-quote-360').addEventListener('click', () => {
        openQuote360Modal(orc.id);
      });

      const btnQuickApprove = tr.querySelector('.btn-quick-approve-orc');
      if (btnQuickApprove) {
        btnQuickApprove.addEventListener('click', () => {
          aprovarETransformarOrcamento(orc.id);
        });
      }

      tbody.appendChild(tr);
    });
  };

  const openQuote360Modal = (quoteId) => {
    const orc = state.quotes.find(q => q.id === quoteId);
    if (!orc) return;

    const modal = document.getElementById('modal-view-quote-detail');
    const modalTitle = document.getElementById('quote-modal-title');
    const modalSubtitle = document.getElementById('quote-modal-subtitle');
    const modalBody = document.getElementById('quote-modal-body');
    const modalFooter = document.getElementById('quote-modal-footer');
    if (!modal || !modalBody) return;

    modalTitle.textContent = `Orçamento Comercial • ${orc.id}`;
    modalSubtitle.textContent = `Cliente: ${orc.clientName} (CNPJ: ${orc.cnpj || '12.345.678/0001-90'}) • Vendedor: ${orc.seller} • Validade: ${orc.validUntil}`;

    const itemsRows = orc.items.map(item => `
      <tr>
        <td><strong>${item.name}</strong><br><small style="color:var(--text-dim); font-size:10px;">${item.package || 'Embalagem Padrão'}</small></td>
        <td style="text-align:center;">${item.qty} un</td>
        <td style="text-align:right; font-family:var(--font-mono);">${formatCurrency(item.unitPrice)}</td>
        <td style="text-align:center; color:var(--status-success);">${item.discount ? `${item.discount}%` : '0%'}</td>
        <td style="text-align:right; font-family:var(--font-mono); font-weight:700;">${formatCurrency(item.total || (item.qty * item.unitPrice))}</td>
      </tr>
    `).join('');

    modalBody.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; background:var(--bg-surface-subtle); padding:12px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
        <div>
          <span style="font-size:11px; color:var(--text-dim); display:block;">Dados do Cliente</span>
          <strong style="font-size:13px; color:var(--text-main);">${orc.clientName}</strong>
          <div style="font-size:11px; color:var(--text-muted);">CNPJ: ${orc.cnpj || '12.345.678/0001-90'}</div>
          <div style="font-size:11px; color:var(--text-muted);">${orc.paymentTerms || 'Faturado 15/30 DDL'}</div>
        </div>
        <div>
          <span style="font-size:11px; color:var(--text-dim); display:block;">Prazos & Emissão</span>
          <div style="font-size:12px;">Emissão: <strong>${orc.date}</strong></div>
          <div style="font-size:12px; color:var(--status-warning);">Validade: <strong>${orc.validUntil}</strong></div>
          <div style="font-size:12px;">Previsão Entrega: <strong>${orc.deliveryEstimate || '24 a 48 horas'}</strong></div>
        </div>
        <div>
          <span style="font-size:11px; color:var(--text-dim); display:block;">Status da Cotação</span>
          <span class="status-pill ${orc.status}" style="font-size:12px; margin-top:4px; display:inline-block;">${orc.status.toUpperCase()}</span>
          <div style="font-size:11px; color:var(--text-dim); margin-top:4px;">Volumes: <strong>${orc.itemsCount} unidades</strong></div>
        </div>
      </div>

      <div style="border:1px solid var(--border-color); border-radius:var(--radius-xs); overflow:hidden;">
        <table class="enterprise-table" style="margin:0;">
          <thead>
            <tr>
              <th>Produto / Embalagem</th>
              <th style="width:100px; text-align:center;">Quantidade</th>
              <th style="width:120px; text-align:right;">Preço Unit.</th>
              <th style="width:100px; text-align:center;">Desconto</th>
              <th style="width:140px; text-align:right;">Total Líquido</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:flex-end; background:var(--bg-surface-subtle); padding:14px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
        <div style="font-size:11px; color:var(--text-dim); max-width:60%;">
          <strong>Observações Comerciais & Tributárias:</strong><br>
          ${orc.notes || 'Preços com ICMS-ST e IPI inclusos. Frete CIF incluso para entregas em São Paulo e Grande SP. Vasilhames em regime de comodato com prazo de devolução de 30 dias.'}
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px; color:var(--text-dim);">Total Geral da Proposta:</div>
          <div style="font-size:22px; font-weight:800; font-family:var(--font-mono); color:var(--primary-navy);">${formatCurrency(orc.total)}</div>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <div style="display:flex; gap:8px;">
        <button class="btn-secondary" onclick="window.imprimirOrcamentoPDF('${orc.id}')">
          🖨️ Imprimir Cotação (PDF)
        </button>
        ${orc.status === 'pendente' ? `
          <button class="btn-secondary" style="color:var(--status-danger);" onclick="window.cancelarOrcamento360('${orc.id}')">
            ✕ Cancelar Proposta
          </button>
        ` : ''}
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn-secondary btn-close-modal" style="height:34px; padding:0 16px;">
          Fechar
        </button>
        ${orc.status === 'pendente' ? `
          <button class="btn-add-client" style="background:var(--status-success);" onclick="window.aprovarETransformarOrcamento('${orc.id}')">
            ✓ Aprovar & Gerar Pedido B2B
          </button>
        ` : ''}
      </div>
    `;

    modal.classList.add('active');
  };

  window.imprimirOrcamentoPDF = (quoteId) => {
    showToast(`Gerando PDF executivo do Orçamento ${quoteId}...`, 'info');
    setTimeout(() => {
      showToast(`✓ Orçamento ${quoteId}.pdf gerado e pronto para envio!`, 'success');
    }, 700);
  };

  window.cancelarOrcamento360 = (quoteId) => {
    const orc = state.quotes.find(q => q.id === quoteId);
    if (!orc) return;
    orc.status = 'cancelado';
    document.getElementById('modal-view-quote-detail')?.classList.remove('active');
    renderOrcamentosGrid();
    showToast(`Orçamento ${quoteId} cancelado com sucesso.`, 'warning');
  };

  const aprovarETransformarOrcamento = (quoteId) => {
    const orc = state.quotes.find(q => q.id === quoteId);
    if (!orc) return;

    orc.status = 'aprovado';
    state.selectedB2BClientId = orc.clientId || state.b2bClients[0].id;
    state.b2bOrderCart = orc.items.map(i => {
      const prod = state.products.find(p => p.name.toLowerCase().includes(i.name.toLowerCase().substring(0, 8))) || state.products[0];
      return {
        product: prod,
        quantity: i.qty,
        unitPrice: i.unitPrice,
        discountType: 'percentage',
        discountValue: i.discount || 0,
        packageUnit: i.package || prod.wholesalePackage || 'Embalagem Atacado'
      };
    });

    document.getElementById('modal-view-quote-detail')?.classList.remove('active');
    renderOrcamentosGrid();
    showToast(`Orçamento ${orc.id} aprovado com sucesso e transferido para o Pedido B2B!`, 'success');
    handleSubmenuNavigation('view-vendas-atacado', '- Atacado');
  };

  window.aprovarETransformarOrcamento = aprovarETransformarOrcamento;

  // =========================================================================
  // 3. FISCAL (Pendentes & Conciliação Especializadas)
  // =========================================================================
  const renderFiscalGrid = (filterStatus = 'all', search = '') => {
    const tbody = document.getElementById('fiscal-grid-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = state.fiscalInvoices.filter(inv => {
      const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
      const matchSearch = inv.nfeNumber.includes(search) || 
                          inv.customer.toLowerCase().includes(search.toLowerCase()) ||
                          inv.xmlKey.includes(search);
      return matchStatus && matchSearch;
    });

    let countAut = 0, countProc = 0, countRej = 0;
    state.fiscalInvoices.forEach(i => {
      if (i.status === 'autorizada') countAut++;
      if (i.status === 'processando' || i.status === 'contingencia') countProc++;
      if (i.status === 'rejeitada') countRej++;
    });

    const badgeAut = document.getElementById('count-fiscal-autorizadas');
    const badgeProc = document.getElementById('count-fiscal-processando');
    const badgeRej = document.getElementById('count-fiscal-rejeitadas');
    if (badgeAut) badgeAut.textContent = `${countAut} autorizadas`;
    if (badgeProc) badgeProc.textContent = `${countProc} pendentes`;
    if (badgeRej) badgeRej.textContent = `${countRej} rejeitadas`;

    filtered.forEach(inv => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${inv.nfeNumber}</strong></td>
        <td><span class="tag-badge ${inv.customerType === 'b2b' ? 'tag-b2b' : 'tag-b2c'}">${inv.type}</span></td>
        <td><strong>${inv.customer}</strong></td>
        <td style="color:var(--text-muted); font-size:11px;">${inv.date}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(inv.totalAmount)}</td>
        <td><span class="status-pill ${inv.status}">${inv.statusText || inv.status.toUpperCase()}</span></td>
        <td style="font-family:var(--font-mono); font-size:10px; color:var(--text-dim); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          ${inv.xmlKey}
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button class="btn-secondary btn-view-danfe" style="height:26px; padding:0 8px; font-size:11px;">
              📄 DANFE
            </button>
            ${inv.isCancellable && inv.status === 'autorizada' ? `
              <button class="btn-secondary btn-open-cancel-fiscal" style="color:var(--status-danger); height:26px; padding:0 8px; font-size:11px;">
                ✕ Cancelar
              </button>
            ` : ''}
          </div>
        </td>
      `;

      tr.querySelector('.btn-view-danfe').addEventListener('click', () => {
        openDANFEViewer(inv);
      });

      const btnCancel = tr.querySelector('.btn-open-cancel-fiscal');
      if (btnCancel) {
        btnCancel.addEventListener('click', () => {
          openFiscalCancelModal(inv);
        });
      }

      tbody.appendChild(tr);
    });
  };

  const renderFiscalPendentesGrid = () => {
    const tbody = document.getElementById('fiscal-pendentes-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const pendingInvoices = state.fiscalInvoices.filter(inv => 
      inv.status === 'processando' || inv.status === 'contingencia' || inv.status === 'rejeitada' || inv.status === 'pendente'
    );

    if (pendingInvoices.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:32px; color:var(--text-dim);">
            ✓ Nenhuma nota fiscal pendente ou em contingência na fila da Sefaz. Todas as notas estão 100% autorizadas!
          </td>
        </tr>
      `;
      return;
    }

    pendingInvoices.forEach(inv => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${inv.nfeNumber}</strong></td>
        <td><span class="tag-badge ${inv.customerType === 'b2b' ? 'tag-b2b' : 'tag-b2c'}">${inv.type}</span></td>
        <td><strong>${inv.customer}</strong></td>
        <td style="color:var(--text-muted); font-size:11px;">${inv.date}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(inv.totalAmount)}</td>
        <td><span class="status-pill ${inv.status}">${inv.statusText || inv.status.toUpperCase()}</span></td>
        <td style="font-size:11px; color:var(--status-danger);">${inv.rejectionReason || 'Aguardando lote de transmissão Sefaz SP'}</td>
        <td style="text-align:right;">
          <button class="btn-add-client btn-transmit-pending" style="min-height:26px; height:auto; padding:4px 8px; font-size:11px; background:var(--primary-navy);" data-id="${inv.id}">
            ⚡ Transmitir
          </button>
        </td>
      `;

      tr.querySelector('.btn-transmit-pending').addEventListener('click', () => {
        transmitirNotaPendente(inv.id);
      });

      tbody.appendChild(tr);
    });
  };

  const transmitirNotaPendente = (invId) => {
    const inv = state.fiscalInvoices.find(i => i.id === invId);
    if (!inv) return;

    showToast(`Transmitindo NF-e ${inv.nfeNumber} para os servidores da Sefaz...`, 'info');
    setTimeout(() => {
      inv.status = 'autorizada';
      inv.statusText = 'Autorizada';
      inv.protocol = `13526092${Math.floor(100000 + Math.random() * 900000)}`;
      inv.xmlKey = `35260918342981000144550010000842201084220${Math.floor(100 + Math.random() * 900)}`;
      inv.isCancellable = true;
      delete inv.rejectionReason;

      renderFiscalPendentesGrid();
      showToast(`✓ Nota Fiscal nº ${inv.nfeNumber} autorizada pela Sefaz com sucesso! Protocolo: ${inv.protocol}`, 'success');
    }, 800);
  };

  window.transmitirNotaPendente = transmitirNotaPendente;

  const renderFiscalConciliacaoGrid = () => {
    const tbody = document.getElementById('fiscal-conciliacao-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.fiscalReconciliationData.forEach(item => {
      const isMatched = item.diff === 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${item.id}</strong></td>
        <td><strong style="font-family:var(--font-mono);">${item.nfe}</strong></td>
        <td>${item.client}</td>
        <td style="font-family:var(--font-mono); font-weight:600;">${formatCurrency(item.fiscalValue)}</td>
        <td style="font-family:var(--font-mono);">${formatCurrency(item.financialValue)}</td>
        <td style="font-family:var(--font-mono);">${item.gateway}</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${isMatched ? 'var(--status-success)' : 'var(--status-danger)'};">
          ${isMatched ? 'R$ 0,00' : formatCurrency(item.diff)}
        </td>
        <td>
          <span class="status-pill ${item.status === 'conciliado' ? 'pago' : 'analise'}">
            ${item.status.toUpperCase()}
          </span>
        </td>
        <td style="text-align:right;">
          ${item.status !== 'conciliado' ? `
            <button class="btn-secondary btn-conciliar-item" style="height:26px; padding:0 8px; font-size:11px; background:var(--status-success-bg); color:var(--status-success); border-color:var(--status-success-border);">
              ✓ Conciliar
            </button>
          ` : `
            <span style="font-size:11px; color:var(--text-dim);">Auditado</span>
          `}
        </td>
      `;

      const btnConciliar = tr.querySelector('.btn-conciliar-item');
      if (btnConciliar) {
        btnConciliar.addEventListener('click', () => {
          item.status = 'conciliado';
          item.diff = 0;
          item.financialValue = item.fiscalValue;
          renderFiscalConciliacaoGrid();
          showToast(`Nota Fiscal ${item.nfe} conciliada com sucesso!`, 'success');
        });
      }

      tbody.appendChild(tr);
    });
  };

  window.executarConciliacaoAutomatica = () => {
    showToast('Executando varredura e conciliação automática com adquirentes e extratos bancários...', 'info');
    setTimeout(() => {
      state.fiscalReconciliationData.forEach(item => {
        item.status = 'conciliado';
        item.diff = 0;
        item.financialValue = item.fiscalValue;
      });
      renderFiscalConciliacaoGrid();
      showToast('✓ 100% das notas fiscais emitidas foram conciliadas com o financeiro!', 'success');
    }, 900);
  };

  // =========================================================================
  // 4. CAIXA (Abertura com Detalhamento Clicável, Fechamento & Movimentação)
  // =========================================================================
  const renderCaixasAberturaGrid = () => {
    const container = document.getElementById('caixas-terminais-grid');
    if (!container) return;

    container.innerHTML = '';
    state.cashRegisters.forEach(reg => {
      const card = document.createElement('div');
      card.className = `cash-terminal-card ${reg.status === 'aberto' ? 'active-terminal' : 'closed-terminal'}`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <strong style="font-size:14px; color:var(--text-main);">${reg.name}</strong>
            <div style="font-size:11px; color:var(--text-dim); margin-top:2px;">Terminal ID: ${reg.id}</div>
          </div>
          <span class="status-pill ${reg.status === 'aberto' ? 'ativo' : 'rejeitada'}" style="font-size:11px;">
            ${reg.status === 'aberto' ? 'ABERTO' : 'FECHADO'}
          </span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; background:var(--bg-surface-subtle); padding:10px; border-radius:var(--radius-xs);">
          <div>
            <span style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Operador Atual</span>
            <div style="font-weight:600; font-size:12px; color:var(--text-main);">${reg.operator}</div>
          </div>
          <div>
            <span style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Fundo de Troco</span>
            <div style="font-family:var(--font-mono); font-weight:700; font-size:12px; color:var(--text-main);">${formatCurrency(reg.openingBalance)}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:8px;">
          <div>
            <span style="font-size:10px; color:var(--text-dim);">Saldo Total Atual:</span>
            <div style="font-size:16px; font-weight:800; font-family:var(--font-mono); color:${reg.status === 'aberto' ? 'var(--status-success)' : 'var(--text-dim)'};">
              ${formatCurrency(reg.currentBalance)}
            </div>
          </div>
          <button class="btn-secondary" style="height:28px; padding:0 10px; font-size:11px; font-weight:600; color:var(--primary-navy);" type="button">
            🔍 Inspecionar Caixa
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        openRegisterDetailModal(reg.id);
      });

      container.appendChild(card);
    });
  };

  const openRegisterDetailModal = (registerId) => {
    const reg = state.cashRegisters.find(r => r.id === registerId);
    if (!reg) return;

    const modal = document.getElementById('modal-register-detail');
    const title = document.getElementById('register-modal-title');
    const subtitle = document.getElementById('register-modal-subtitle');
    const body = document.getElementById('register-modal-body');
    if (!modal || !body) return;

    title.textContent = `${reg.name} • Detalhamento Operacional de Turno`;
    subtitle.textContent = `Operador: ${reg.operator} • Abertura: ${reg.openingTime} • Status: ${reg.status.toUpperCase()}`;

    body.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
        <div class="client-kpi-box">
          <span class="kpi-sub-label">Fundo Inicial</span>
          <span class="kpi-main-num" style="font-size:16px;">${formatCurrency(reg.openingBalance)}</span>
        </div>
        <div class="client-kpi-box">
          <span class="kpi-sub-label">Vendas do Turno</span>
          <span class="kpi-main-num" style="font-size:16px; color:var(--status-success);">${formatCurrency(reg.salesTotal || (reg.currentBalance - reg.openingBalance))}</span>
        </div>
        <div class="client-kpi-box">
          <span class="kpi-sub-label">Saldo em Caixa</span>
          <span class="kpi-main-num" style="font-size:16px; color:var(--primary-navy);">${formatCurrency(reg.currentBalance)}</span>
        </div>
      </div>

      <div style="border:1px solid var(--border-color); border-radius:var(--radius-xs); overflow:hidden;">
        <div style="padding:8px 12px; background:var(--bg-surface-subtle); font-weight:700; font-size:12px; border-bottom:1px solid var(--border-color);">
          Desdobramento por Forma de Pagamento
        </div>
        <table class="enterprise-table" style="margin:0;">
          <tbody>
            <tr><td>💵 Dinheiro em Espécie (Físico na Gaveta)</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700;">${formatCurrency(reg.breakdown?.dinheiro || 1240.00)}</td></tr>
            <tr><td>⚡ PIX Instantâneo (QR Code Dinâmico)</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700;">${formatCurrency(reg.breakdown?.pix || 2850.00)}</td></tr>
            <tr><td>💳 TEF Cartão de Débito</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700;">${formatCurrency(reg.breakdown?.debito || 1620.00)}</td></tr>
            <tr><td>💳 TEF Cartão de Crédito</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700;">${formatCurrency(reg.breakdown?.credito || 2110.00)}</td></tr>
            <tr><td>🛑 Sangrias Realizadas</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--status-danger);">- ${formatCurrency(reg.breakdown?.sangrias || 350.00)}</td></tr>
            <tr><td>💵 Suprimentos Injetados</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--status-success);">+ ${formatCurrency(reg.breakdown?.suprimentos || 200.00)}</td></tr>
          </tbody>
        </table>
      </div>

      <div style="font-size:11px; color:var(--text-dim); background:var(--bg-surface-subtle); padding:10px; border-radius:var(--radius-xs);">
        💡 Este terminal está conectado ao leitor óptico e impressora não fiscal de 80mm com autorização Sefaz em contingência e online.
      </div>
    `;

    modal.classList.add('active');
  };

  const renderCaixaFechamentoView = () => {
    const reg = state.cashRegisters.find(r => r.id === 'CX-02') || state.cashRegisters[0];
    const systemExpected = reg.currentBalance;

    const valDinheiro = parseFloat(document.getElementById('fechamento-dinheiro')?.value) || 0;
    const valPix = parseFloat(document.getElementById('fechamento-pix')?.value) || 0;
    const valCartao = parseFloat(document.getElementById('fechamento-cartao')?.value) || 0;

    const totalInformado = valDinheiro + valPix + valCartao;
    const diff = totalInformado - systemExpected;

    const sumSysEl = document.getElementById('fechamento-sistema-total');
    const sumInfEl = document.getElementById('fechamento-informado-total');
    const diffEl = document.getElementById('fechamento-diferenca');

    if (sumSysEl) sumSysEl.textContent = formatCurrency(systemExpected);
    if (sumInfEl) sumInfEl.textContent = formatCurrency(totalInformado);
    if (diffEl) {
      if (Math.abs(diff) < 0.01) {
        diffEl.innerHTML = `<span style="color:var(--status-success); font-weight:700;">R$ 0,00 (Sem Quebra de Caixa)</span>`;
      } else if (diff > 0) {
        diffEl.innerHTML = `<span style="color:var(--status-warning); font-weight:700;">+ ${formatCurrency(diff)} (Sobra de Caixa)</span>`;
      } else {
        diffEl.innerHTML = `<span style="color:var(--status-danger); font-weight:700;">- ${formatCurrency(Math.abs(diff))} (Quebra de Caixa)</span>`;
      }
    }
  };

  window.confirmarFechamentoCaixa = () => {
    showToast('Processando fechamento cego de turno, emitindo espelho Z e registrando auditoria...', 'info');
    setTimeout(() => {
      const reg = state.cashRegisters.find(r => r.id === 'CX-02');
      if (reg) {
        reg.status = 'fechado';
        reg.currentBalance = 0;
      }
      showToast('✓ Caixa 02 fechado com sucesso! Espelho de Redução Z impresso e auditoria salva.', 'success');
      handleSubmenuNavigation('view-caixa-todos', '- Todos os Caixas');
    }, 850);
  };

  const renderCaixaMovementsGrid = () => {
    const tbody = document.getElementById('caixa-movimentacoes-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.cashMovements.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${m.id}</strong></td>
        <td>${m.time}</td>
        <td>
          <span class="status-pill ${m.type === 'suprimento' ? 'ativo' : m.type === 'sangria' ? 'rejeitada' : 'processando'}">
            ${m.type.toUpperCase()}
          </span>
        </td>
        <td>${m.caixa}</td>
        <td>${m.reason}</td>
        <td>${m.operator}</td>
        <td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:${m.type === 'sangria' ? 'var(--status-danger)' : 'var(--status-success)'};">
          ${m.type === 'sangria' ? '-' : '+'} ${formatCurrency(m.value)}
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  const renderCaixaTodosGrid = () => {
    const tbody = document.getElementById('caixa-todos-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.cashSessionsHistory.forEach(sess => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${sess.id}</strong></td>
        <td><strong>${sess.terminal}</strong></td>
        <td>${sess.operator}</td>
        <td>${sess.date}</td>
        <td style="color:var(--text-muted); font-size:11px;">${sess.openedAt} às ${sess.closedAt}</td>
        <td style="font-family:var(--font-mono);">${formatCurrency(sess.openingBalance)}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(sess.grossTotal)}</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${sess.difference === 0 ? 'var(--status-success)' : 'var(--status-danger)'};">
          ${sess.difference === 0 ? 'R$ 0,00' : formatCurrency(sess.difference)}
        </td>
        <td><span class="status-pill ${sess.auditStatus === 'aprovado' ? 'pago' : 'analise'}">${sess.auditStatus.toUpperCase()}</span></td>
      `;
      tbody.appendChild(tr);
    });
  };

  // =========================================================================
  // 5. ESTOQUE (Entrada Avulsa, Kardex, Lote, Min/Max & Movimentação)
  // =========================================================================
  const renderEstoqueAvulsoView = () => {
    const select = document.getElementById('avulso-produto');
    if (select) {
      select.innerHTML = state.products.map(p => 
        `<option value="${p.id}">${p.name} (Estoque Total: ${p.stock} un | B2B: ${p.stockAtacado || p.stock} un)</option>`
      ).join('');
    }
  };

  window.lancarAjusteEstoqueAvulso = () => {
    const tipo = document.getElementById('avulso-tipo')?.value || 'saida-avaria';
    const prodId = document.getElementById('avulso-produto')?.value;
    const stockType = document.getElementById('avulso-estoque-tipo')?.value || 'atacado';
    const qty = parseInt(document.getElementById('avulso-qtd')?.value) || 1;
    const motivo = document.getElementById('avulso-motivo')?.value || 'Ajuste operacional manual';
    const operador = document.getElementById('avulso-operador')?.value || 'Marcos Almoxarife';

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;

    const isEntrada = tipo.startsWith('entrada');
    const oldStock = prod.stock;
    if (isEntrada) {
      prod.stock += qty;
      if (stockType === 'atacado' && prod.stockAtacado !== undefined) prod.stockAtacado += qty;
    } else {
      prod.stock = Math.max(0, prod.stock - qty);
      if (stockType === 'atacado' && prod.stockAtacado !== undefined) prod.stockAtacado = Math.max(0, prod.stockAtacado - qty);
    }

    state.stockKardex.unshift({
      id: `KDX-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString('pt-BR'),
      productName: prod.name,
      type: isEntrada ? 'entrada' : 'saida',
      documentRef: `AJUSTE-MANUAL-${tipo.toUpperCase()}`,
      qtyMoved: qty,
      priorStock: oldStock,
      newStock: prod.stock,
      location: prod.location || 'Depósito Principal',
      operator: operador,
      notes: motivo
    });

    showToast(`✓ Ajuste de ${qty} un em ${prod.name} registrado com sucesso no Kardex!`, 'success');
    handleSubmenuNavigation('view-estoque-historico', '- Histórico');
  };

  const renderEstoqueCadastroForm = () => {
    // Foca no primeiro campo do formulário de cadastro de produto
    const nomeInp = document.getElementById('cad-prod-nome');
    if (nomeInp) nomeInp.focus();
  };

  window.salvarNovoProdutoEstoque = () => {
    const nome = document.getElementById('cad-prod-nome')?.value.trim();
    const sku = document.getElementById('cad-prod-sku')?.value.trim();
    const cat = document.getElementById('cad-prod-categoria')?.value || 'cervejas';
    const barcode = document.getElementById('cad-prod-barcode')?.value.trim() || '789123456099';
    const fornecedor = document.getElementById('cad-prod-fornecedor')?.value || 'Ambev Distribuição';
    const ncm = document.getElementById('cad-prod-ncm')?.value.trim() || '2203.00.00';
    const cest = document.getElementById('cad-prod-cest')?.value.trim() || '03.001.00';
    const regime = document.getElementById('cad-prod-regime')?.value || 'Simples Nacional';
    const cst = document.getElementById('cad-prod-cst')?.value || '500';
    const cfop = document.getElementById('cad-prod-cfop')?.value.trim() || '5.405';
    const piscofins = document.getElementById('cad-prod-piscofins')?.value || 'Monofasico';
    const custo = parseFloat(document.getElementById('cad-prod-custo')?.value) || 100;
    const precoVarejo = parseFloat(document.getElementById('cad-prod-preco-varejo')?.value) || 150;
    const precoAtacado = parseFloat(document.getElementById('cad-prod-preco-atacado')?.value) || 135;
    const embalagem = document.getElementById('cad-prod-embalagem')?.value.trim() || 'Fardo c/ 12';
    const stockAtacado = parseInt(document.getElementById('cad-prod-stock-atacado')?.value) || 10;
    const stockVarejo = parseInt(document.getElementById('cad-prod-stock-varejo')?.value) || 5;
    const minStock = parseInt(document.getElementById('cad-prod-min')?.value) || 10;
    const maxStock = parseInt(document.getElementById('cad-prod-max')?.value) || 50;
    const local = document.getElementById('cad-prod-local')?.value.trim() || 'Câmara Fria A1';

    if (!nome || !sku) {
      showToast('Preencha ao menos o Nome e o SKU do produto.', 'danger');
      return;
    }

    const newProd = {
      id: `PROD-${String(state.products.length + 1).padStart(3, '0')}`,
      sku,
      name: nome,
      barcode,
      category: cat,
      supplier: fornecedor,
      ncm,
      cest,
      regime,
      cst,
      cfop,
      piscofins,
      cost: custo,
      price: precoVarejo,
      wholesalePrice: precoAtacado,
      wholesalePackage: embalagem,
      stock: stockAtacado + stockVarejo,
      stockAtacado,
      stockVarejo,
      minStock,
      maxStock,
      location: local,
      type: cat === 'barris' ? 'b2b' : 'b2c'
    };

    state.products.unshift(newProd);
    showToast(`✓ Produto "${nome}" cadastrado com sucesso com dados fiscais (NCM ${ncm} / CEST ${cest})!`, 'success');
    handleSubmenuNavigation('view-estoque-todos', '- Todos os itens');
  };

  const renderEstoqueHistoricoKardex = () => {
    const tbody = document.getElementById('estoque-historico-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.stockKardex.forEach(k => {
      const isEntrada = k.type === 'entrada';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${k.id}</strong></td>
        <td style="color:var(--text-muted); font-size:11px;">${k.date}</td>
        <td><strong>${k.productName}</strong></td>
        <td>
          <span class="status-pill ${isEntrada ? 'ativo' : 'rejeitada'}">
            ${isEntrada ? 'ENTRADA (+)' : 'SAÍDA (-)'}
          </span>
        </td>
        <td><span style="font-family:var(--font-mono); font-size:11px;">${k.documentRef}</span></td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${isEntrada ? 'var(--status-success)' : 'var(--status-danger)'};">
          ${isEntrada ? '+' : '-'} ${k.qtyMoved} un
        </td>
        <td style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim);">
          ${k.priorStock} un ➔ <strong>${k.newStock} un</strong>
        </td>
        <td>${k.location}</td>
        <td style="font-size:11px; color:var(--text-muted);">${k.operator}</td>
      `;
      tbody.appendChild(tr);
    });
  };

  const renderEstoqueGrid = () => {
    const tbody = document.getElementById('estoque-grid-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const searchInp = document.getElementById('estoque-search-input')?.value.toLowerCase() || '';

    const filtered = state.products.filter(p => {
      return p.name.toLowerCase().includes(searchInp) ||
             p.sku.toLowerCase().includes(searchInp) ||
             (p.ncm && p.ncm.includes(searchInp)) ||
             (p.location && p.location.toLowerCase().includes(searchInp));
    });

    filtered.forEach(p => {
      const isBelowMin = p.stock <= p.minStock;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${p.sku}</strong></td>
        <td>
          <input type="text" class="input-editable edit-name" data-id="${p.id}" value="${p.name}" style="width:100%; font-weight:bold; font-size:12px; margin-bottom:2px;"><br>
          <small style="color:var(--text-dim); font-size:10px;">📦 ${p.wholesalePackage || p.vasilhameType || 'Embalagem Padrão'} • NCM: ${p.ncm || '2203.00.00'}</small>
        </td>
        <td>
          <select class="input-editable edit-category" data-id="${p.id}" style="width:100%; font-size:11px; height:24px; padding:0;">
            <option value="cervejas" ${p.category === 'cervejas' ? 'selected' : ''}>Cervejas</option>
            <option value="destilados" ${p.category === 'destilados' ? 'selected' : ''}>Destilados</option>
            <option value="não-alcoólicos" ${p.category === 'não-alcoólicos' ? 'selected' : ''}>Não-Alcoólicos</option>
            <option value="vinhos" ${p.category === 'vinhos' ? 'selected' : ''}>Vinhos</option>
            <option value="mercearia" ${p.category === 'mercearia' ? 'selected' : ''}>Mercearia</option>
          </select>
        </td>
        <td><input type="text" class="input-editable edit-location" data-id="${p.id}" value="${p.location || ''}" style="width:100%; font-size:11px; text-align:center;"></td>
        <td style="text-align:center;">
          <input type="number" class="input-editable edit-stock" data-id="${p.id}" value="${p.stock}" style="width:50px; font-family:var(--font-mono); font-weight:700; color:${isBelowMin ? 'var(--status-danger)' : 'var(--text-main)'}; text-align:center;"><br>
          <small style="font-size:10px; color:var(--text-dim);">Atacado: <input type="number" class="input-editable edit-stock-atacado" data-id="${p.id}" value="${p.stockAtacado !== undefined ? p.stockAtacado : p.stock}" style="width:40px; padding:0; height:18px; text-align:center;"></small>
        </td>
        <td style="font-family:var(--font-mono); color:var(--text-dim); font-size:11px; display:flex; gap:2px; justify-content:center;">
          <input type="number" class="input-editable edit-min" data-id="${p.id}" value="${p.minStock}" style="width:36px; text-align:center;"> / 
          <input type="number" class="input-editable edit-max" data-id="${p.id}" value="${p.maxStock}" style="width:36px; text-align:center;">
        </td>
        <td><input type="number" step="0.01" class="input-editable edit-cost" data-id="${p.id}" value="${p.cost}" style="width:100%; font-family:var(--font-mono); font-size:11px; text-align:right;"></td>
        <td style="font-family:var(--font-mono); font-weight:700;">
          <input type="number" step="0.01" class="input-editable edit-b2b-price" data-id="${p.id}" value="${p.wholesalePrice || p.price}" style="width:100%; text-align:right;"><br>
          <small style="font-size:10px; color:var(--text-dim); font-weight:400; display:flex; justify-content:flex-end; align-items:center;">PDV: <input type="number" step="0.01" class="input-editable edit-pdv-price" data-id="${p.id}" value="${p.price}" style="width:50px; padding:0; height:18px; text-align:right; margin-left:4px;"></small>
        </td>
        <td>
          <span class="status-pill ${isBelowMin ? 'rejeitada' : 'ativo'}">
            ${isBelowMin ? 'Reposição Necessária' : 'Estoque Regular'}
          </span>
        </td>
      `;

      const attach = (cls, prop, isFloat = false, isInt = false) => {
        const els = tr.querySelectorAll('.' + cls);
        els.forEach(el => {
          el.addEventListener('change', (e) => {
            let val = e.target.value;
            if (isFloat) val = parseFloat(val) || 0;
            else if (isInt) val = parseInt(val) || 0;
            p[prop] = val;
            window.showToast('Produto atualizado.', 'success');
            if (prop === 'stock' || prop === 'minStock') {
               renderEstoqueGrid();
            }
          });
        });
      };
      
      attach('edit-name', 'name');
      attach('edit-category', 'category');
      attach('edit-location', 'location');
      attach('edit-stock', 'stock', false, true);
      attach('edit-stock-atacado', 'stockAtacado', false, true);
      attach('edit-min', 'minStock', false, true);
      attach('edit-max', 'maxStock', false, true);
      attach('edit-cost', 'cost', true);
      attach('edit-b2b-price', 'wholesalePrice', true);
      attach('edit-pdv-price', 'price', true);
      
      tbody.appendChild(tr);
    });
  };

  const renderEstoqueLoteGrid = () => {
    const tbody = document.getElementById('estoque-lote-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const catFilter = state.loteSelectedCategory || 'all';

    const prods = state.products.filter(p => {
      if (catFilter === 'all') return true;
      return p.category === catFilter;
    });

    prods.forEach(p => {
      const isSelected = state.selectedLoteProductIds.includes(p.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">
          <input type="checkbox" class="chk-lote-item" data-id="${p.id}" ${isSelected ? 'checked' : ''} style="cursor:pointer; width:16px; height:16px;">
        </td>
        <td><strong style="font-family:var(--font-mono);">${p.sku}</strong></td>
        <td><strong>${p.name}</strong></td>
        <td><span class="tag-badge ${p.type === 'b2b' ? 'tag-b2b' : 'tag-b2c'}">${p.category.toUpperCase()}</span></td>
        <td style="font-family:var(--font-mono); text-align:right; font-weight:600;">${formatCurrency(p.price)}</td>
        <td style="font-family:var(--font-mono); text-align:right; font-weight:700; color:var(--b2b-purple);">${formatCurrency(p.wholesalePrice || p.price)}</td>
        <td style="font-family:var(--font-mono); text-align:center; font-weight:700;">${p.stock} un</td>
        <td><span style="font-size:11px; background:var(--bg-surface-subtle); padding:2px 6px; border-radius:3px; border:1px solid var(--border-subtle);">${p.location || 'Depósito Principal'}</span></td>
      `;

      tr.querySelector('.chk-lote-item').addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!state.selectedLoteProductIds.includes(p.id)) state.selectedLoteProductIds.push(p.id);
        } else {
          state.selectedLoteProductIds = state.selectedLoteProductIds.filter(id => id !== p.id);
        }
        updateLoteSelectedCount();
      });

      tbody.appendChild(tr);
    });

    updateLoteSelectedCount();
  };

  const updateLoteSelectedCount = () => {
    const countEl = document.getElementById('lote-selected-count');
    if (countEl) countEl.textContent = state.selectedLoteProductIds.length;
  };

  window.aplicarReajusteLote = () => {
    if (state.selectedLoteProductIds.length === 0) {
      showToast('Selecione ao menos um produto na tabela para aplicar a alteração em lote.', 'warning');
      return;
    }

    const action = document.getElementById('lote-action-type')?.value || 'markup-pct';
    const valInput = document.getElementById('lote-action-val');
    const val = parseFloat(valInput?.value) || 0;
    const strVal = valInput?.value?.trim() || '';

    let modifiedCount = 0;

    state.products.forEach(p => {
      if (state.selectedLoteProductIds.includes(p.id)) {
        modifiedCount++;
        if (action === 'markup-pct') {
          p.price = +(p.price * (1 + (val / 100))).toFixed(2);
          if (p.wholesalePrice) p.wholesalePrice = +(p.wholesalePrice * (1 + (val / 100))).toFixed(2);
        } else if (action === 'markup-fixed') {
          p.price = +(p.price + val).toFixed(2);
          if (p.wholesalePrice) p.wholesalePrice = +(p.wholesalePrice + val).toFixed(2);
        } else if (action === 'discount-pct') {
          p.price = +(p.price * (1 - (val / 100))).toFixed(2);
          if (p.wholesalePrice) p.wholesalePrice = +(p.wholesalePrice * (1 - (val / 100))).toFixed(2);
        } else if (action === 'set-pdv-price') {
          p.price = val > 0 ? val : p.price;
        } else if (action === 'set-b2b-price') {
          p.wholesalePrice = val > 0 ? val : (p.wholesalePrice || p.price);
        } else if (action === 'set-stock-total') {
          p.stock = Math.max(0, parseInt(val) || 0);
        } else if (action === 'change-location') {
          p.location = strVal || 'Galpão Setor R2';
        } else if (action === 'append-name') {
          if (strVal && !p.name.includes(strVal)) p.name = `${p.name} ${strVal}`;
        }
      }
    });

    renderEstoqueLoteGrid();
    renderEstoqueGrid();
    showToast(`✓ Alteração em lote aplicada com sucesso para ${modifiedCount} produtos selecionados!`, 'success');
  };

  const renderEstoqueMinMaxGrid = () => {
    const tbody = document.getElementById('estoque-minmax-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.products.forEach(p => {
      const isCritical = p.stock <= p.minStock;
      const deficit = Math.max(0, p.maxStock - p.stock);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${p.sku}</strong></td>
        <td><strong>${p.name}</strong></td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${isCritical ? 'var(--status-danger)' : 'var(--text-main)'}; font-size:14px;">
          ${p.stock} un
        </td>
        <td style="font-family:var(--font-mono); color:var(--status-danger);">${p.minStock} un</td>
        <td style="font-family:var(--font-mono); color:var(--text-dim);">${p.maxStock} un</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:var(--status-warning);">${deficit} un</td>
        <td>
          <span class="status-pill ${isCritical ? 'rejeitada' : 'ativo'}">
            ${isCritical ? 'RUPTURA IMINENTE' : 'NÍVEL ADEQUADO'}
          </span>
        </td>
        <td style="text-align:right;">
          ${isCritical ? `
            <button class="btn-secondary btn-order-minmax" style="height:26px; padding:0 8px; font-size:11px; background:var(--status-warning-bg); color:var(--status-warning); border-color:var(--status-warning-border);" data-prod="${p.name}">
              ⚡ Gerar Ordem Reposição
            </button>
          ` : `
            <span style="font-size:11px; color:var(--text-dim);">Estoque Seguro</span>
          `}
        </td>
      `;

      const btnOrder = tr.querySelector('.btn-order-minmax');
      if (btnOrder) {
        btnOrder.addEventListener('click', () => {
          showToast(`Ordem de reposição gerada para ${p.name} (${deficit} unidades enviadas para o setor de Compras)!`, 'success');
          handleSubmenuNavigation('view-compras-sugestao', '- Sugestão de compra');
        });
      }

      tbody.appendChild(tr);
    });
  };

  const renderEstoqueMovimentacaoView = () => {
    const selProd = document.getElementById('trf-produto');
    if (selProd) {
      selProd.innerHTML = state.products.map(p => 
        `<option value="${p.id}">${p.name} (Saldo Total: ${p.stock} un | Local: ${p.location || 'Depósito Principal'})</option>`
      ).join('');
    }

    const tbody = document.getElementById('estoque-transf-history-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      state.stockTransfers.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong style="font-family:var(--font-mono);">${t.id}</strong></td>
          <td style="color:var(--text-muted); font-size:11px;">${t.date}</td>
          <td><strong>${t.productName}</strong></td>
          <td style="font-family:var(--font-mono); font-weight:700;">${t.quantity} un</td>
          <td>${t.origin}</td>
          <td><strong style="color:var(--primary-navy);">${t.destination}</strong></td>
          <td>${t.operator}</td>
          <td><span class="status-pill ativo">CONCLUÍDA</span></td>
        `;
        tbody.appendChild(tr);
      });
    }
  };

  window.executarTransferenciaEstoque = () => {
    const prodId = document.getElementById('trf-produto')?.value;
    const orig = document.getElementById('trf-origem')?.value || 'Galpão Matriz';
    const dest = document.getElementById('trf-destino')?.value || 'Frente de Loja / Balcão';
    const qty = parseInt(document.getElementById('transf-qtd')?.value) || 1;
    const operador = document.getElementById('transf-operador')?.value || 'Marcos Almoxarife';

    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;

    if (orig === dest) {
      showToast('O local de origem e destino devem ser diferentes.', 'warning');
      return;
    }

    state.stockTransfers.unshift({
      id: `TRF-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString('pt-BR'),
      productName: prod.name,
      quantity: qty,
      origin: orig,
      destination: dest,
      operator: operador,
      status: 'concluida'
    });

    renderEstoqueMovimentacaoView();
    showToast(`✓ Transferência de ${qty} un de "${prod.name}" para ${dest} efetuada com sucesso!`, 'success');
  };

  // =========================================================================
  // 6. COMPRAS (Sugestão, Saída/ABC, Teto & Preços)
  // =========================================================================
  const renderComprasSugestaoGrid = () => {
    const tbody = document.getElementById('compras-sugestao-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.purchaseSuggestions.forEach(s => {
      const isFornecedorBCheaper = s.priceB < s.priceA;
      const calcDif = Math.abs(s.priceA - s.priceB);
      const difText = formatCurrency(calcDif);
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${s.product}</strong><br>
          <small style="color:var(--text-dim); font-size:10px;">${s.reason}</small>
        </td>
        <td>
          <div style="font-size:11px;">${s.supplierA}</div>
          <strong style="color:${!isFornecedorBCheaper ? 'var(--status-success)' : 'var(--text-main)'}; font-family:var(--font-mono);">${formatCurrency(s.priceA)} / un</strong>
        </td>
        <td>
          <div style="font-size:11px;">${s.supplierB}</div>
          <strong style="color:${isFornecedorBCheaper ? 'var(--status-success)' : 'var(--text-main)'}; font-family:var(--font-mono);">${formatCurrency(s.priceB)} / un</strong>
        </td>
        <td style="font-family:var(--font-mono); text-align:center;">
          <span style="color:var(--status-danger); font-weight:700;">2 un</span> / 
          <span style="color:var(--text-dim);">15 un</span>
        </td>
        <td style="text-align:center;">
          <input type="number" class="input-editable" value="13" style="width:50px; font-weight:bold; text-align:center; font-family:var(--font-mono);"> un
        </td>
        <td style="text-align:right;">
          <span style="font-size:11px; color:var(--status-success); font-weight:700; background:var(--status-success-bg); padding:2px 6px; border-radius:4px;">
            Economia de ${difText}/un no ${isFornecedorBCheaper ? 'Fornecedor B' : 'Fornecedor A'}
          </span>
        </td>
        <td style="text-align:center;">
          <button class="btn-primary" style="padding:4px 10px; font-size:10px;" onclick="window.showToast('Pedido de cotação/compra gerado para o fornecedor mais vantajoso!', 'success')">
            Comprar ${isFornecedorBCheaper ? 'B' : 'A'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  const renderComprasSaidaGrid = () => {
    const tbody = document.getElementById('compras-saida-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.products.forEach((p, idx) => {
      const mediaDiaria = (p.stock / 5 + (idx + 1) * 2.5).toFixed(1);
      const diasRestantes = Math.round(p.stock / (parseFloat(mediaDiaria) || 1));
      const curva = idx < 3 ? 'Curva A' : idx < 7 ? 'Curva B' : 'Curva C';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${p.sku}</strong></td>
        <td><strong>${p.name}</strong></td>
        <td><span class="tag-badge ${curva === 'Curva A' ? 'tag-b2b' : 'tag-b2c'}">${curva}</span></td>
        <td style="font-family:var(--font-mono); font-weight:700;">${Math.round(parseFloat(mediaDiaria) * 30)} un</td>
        <td style="font-family:var(--font-mono);">${mediaDiaria} un/dia</td>
        <td style="font-family:var(--font-mono);">${p.stock} un</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${diasRestantes < 7 ? 'var(--status-danger)' : 'var(--status-success)'};">
          ${diasRestantes} dias
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  const renderComprasTetoGrid = () => {
    const tbody = document.getElementById('compras-teto-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.supplierBudgets.forEach(b => {
      const remaining = b.budgetLimit - b.spentAmount;
      const pct = Math.min(100, Math.round((b.spentAmount / b.budgetLimit) * 100));

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.supplier}</strong></td>
        <td>${b.period}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(b.budgetLimit)}</td>
        <td style="font-family:var(--font-mono); color:var(--primary-navy);">${formatCurrency(b.spentAmount)}</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${remaining < 0 ? 'var(--status-danger)' : 'var(--status-success)'};">
          ${formatCurrency(remaining)}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; background:var(--border-subtle); height:8px; border-radius:4px; overflow:hidden;">
              <div style="width:${pct}%; height:100%; background:${pct > 90 ? 'var(--status-danger)' : 'var(--status-success)'};"></div>
            </div>
            <span style="font-size:11px; font-family:var(--font-mono); font-weight:700;">${pct}%</span>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  const renderComprasPrecosGrid = () => {
    const tbody = document.getElementById('compras-precos-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.priceAnalysisData.forEach(item => {
      const diff = item.currentPrice - item.lastPrice;
      const pct = ((diff / item.lastPrice) * 100).toFixed(1);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.productName}</strong></td>
        <td>${item.supplier}</td>
        <td style="font-family:var(--font-mono); color:var(--text-dim);">${formatCurrency(item.lastPrice)}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(item.currentPrice)}</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${diff > 0 ? 'var(--status-danger)' : 'var(--status-success)'};">
          ${diff > 0 ? '+' : ''}${pct}% (${formatCurrency(diff)})
        </td>
        <td style="font-size:11px; color:var(--text-muted);">${item.lastUpdate}</td>
      `;
      tbody.appendChild(tr);
    });
  };

  // =========================================================================
  // 7. RELATÓRIOS (8 Abas Totalmente Especializadas)
  // =========================================================================
  const renderReportsModule = () => {
    const kpis = state.reportsData.kpis;
    const revEl = document.getElementById('kpi-rep-rev');
    const tktEl = document.getElementById('kpi-rep-ticket');
    const defEl = document.getElementById('kpi-rep-default');
    const casEl = document.getElementById('kpi-rep-cascos');

    if (revEl) revEl.textContent = formatCurrency(kpis.dailyRevenue);
    if (tktEl) tktEl.textContent = formatCurrency(kpis.avgTicket);
    if (defEl) defEl.textContent = `${kpis.defaultRate}%`;
    if (casEl) casEl.textContent = `${kpis.cascosInCirculation} un`;

    renderDrillDownTable();
  };

  const renderDrillDownTable = () => {
    const tbody = document.getElementById('reports-drilldown-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const sales = state.reportsData.detailedSales;

    sales.forEach((sale, idx) => {
      const trMaster = document.createElement('tr');
      trMaster.className = 'drill-row-master';
      trMaster.id = `rep-master-${idx}`;

      trMaster.innerHTML = `
        <td style="text-align:center; color:var(--text-dim);">▾</td>
        <td><strong style="font-family:var(--font-mono);">${sale.saleId}</strong></td>
        <td style="color:var(--text-muted);">${sale.timestamp}</td>
        <td>
          <span class="tag-badge ${sale.type === 'b2b' ? 'tag-b2b' : 'tag-b2c'}">${sale.type.toUpperCase()}</span>
          <span style="margin-left:6px; font-weight:600;">${sale.client}</span>
        </td>
        <td>${sale.channel}</td>
        <td style="font-family:var(--font-mono); color:${sale.discountApplied > 0 ? 'var(--status-success)' : 'var(--text-dim)'};">
          ${sale.discountApplied > 0 ? `- ${formatCurrency(sale.discountApplied)}` : 'R$ 0,00'}
        </td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(sale.netTotal)}</td>
      `;

      const trDetail = document.createElement('tr');
      trDetail.className = 'drill-row-detail';
      trDetail.id = `rep-detail-${idx}`;

      const itemsList = sale.items.map(i => `
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
          <span>${i.qty}x ${i.name}</span>
          <span style="font-family:var(--font-mono);">${formatCurrency(i.total)}</span>
        </div>
      `).join('');

      const paymentsList = sale.payments.map(p => `
        <div style="display:flex; justify-content:space-between; font-size:11px;">
          <span>${p.method}</span>
          <span style="font-family:var(--font-mono); font-weight:600;">${formatCurrency(p.value)}</span>
        </div>
        <div style="font-size:10px; color:var(--text-dim); margin-bottom:4px;">${p.authCode}</div>
      `).join('');

      trDetail.innerHTML = `
        <td colspan="7" style="padding:0;">
          <div class="drill-detail-box">
            <div class="drill-subgrid">
              <div class="drill-card-block">
                <span style="font-size:11px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Itens & Descontos</span>
                <div>${itemsList}</div>
                <div style="margin-top:auto; font-size:11px; color:var(--text-dim); border-top:1px dashed var(--border-subtle); padding-top:4px;">
                  Operador: <strong>${sale.operator}</strong>
                </div>
              </div>

              <div class="drill-card-block">
                <span style="font-size:11px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Rastreio de Pagamento</span>
                <div>${paymentsList}</div>
              </div>

              <div class="drill-card-block">
                <span style="font-size:11px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Dados Fiscais Sefaz</span>
                <div style="font-size:11px; display:flex; flex-direction:column; gap:2px;">
                  <div>Protocolo: <strong>${sale.nfeInfo.protocol}</strong></div>
                  <div>CFOP: <strong>${sale.nfeInfo.cfop}</strong></div>
                  <div>Tributação Est.: <strong>${sale.nfeInfo.taxEstimated}</strong></div>
                  <div style="font-family:var(--font-mono); font-size:9px; color:var(--text-dim); word-break:break-all; margin-top:2px;">
                    Chave: ${sale.nfeInfo.key}
                  </div>
                </div>
                <button class="btn-secondary" style="margin-top:6px; height:28px; font-size:11px;" onclick="window.viewSaleDANFE('${sale.saleId}')">
                  Visualizar DANFE (PDF)
                </button>
              </div>
            </div>
          </div>
        </td>
      `;

      trMaster.addEventListener('click', () => {
        const isExp = trMaster.classList.contains('expanded');
        if (isExp) {
          trMaster.classList.remove('expanded');
          trDetail.classList.remove('show');
        } else {
          trMaster.classList.add('expanded');
          trDetail.classList.add('show');
        }
      });

      tbody.appendChild(trMaster);
      tbody.appendChild(trDetail);
    });
  };

  const renderRelMovimentoGrid = () => {
    const tbody = document.getElementById('rel-movimento-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td>22/09/2026</td><td><strong>Vendas Varejo PDV</strong></td><td>142 cupons fiscais</td><td style="font-family:var(--font-mono); font-weight:700; color:var(--status-success);">+ R$ 24.890,00</td><td>Juliana Silva</td></tr>
      <tr><td>22/09/2026</td><td><strong>Faturamento Atacado B2B</strong></td><td>18 pedidos entregues</td><td style="font-family:var(--font-mono); font-weight:700; color:var(--status-success);">+ R$ 68.450,00</td><td>Rodrigo Martins</td></tr>
      <tr><td>22/09/2026</td><td><strong>Recebimento Fornecedor Ambev</strong></td><td>Carga 45 paletes</td><td style="font-family:var(--font-mono); font-weight:700; color:var(--status-danger);">- R$ 38.900,00</td><td>Marcos Almoxarife</td></tr>
    `;
  };

  const renderRelAuditoriaGrid = () => {
    const tbody = document.getElementById('rel-auditoria-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td>AUD-901</td><td>22/09/2026 14:10</td><td>Cancelamento NF-e 000.084.212</td><td>Juliana Silva</td><td>Erro de digitação da forma de pagamento</td><td><span class="status-pill pago">AUDITADO</span></td></tr>
      <tr><td>AUD-902</td><td>21/09/2026 18:30</td><td>Desconto Manual Acima de 15%</td><td>Rodrigo Martins</td><td>Autorizado por Gerência Comercial</td><td><span class="status-pill pago">AUDITADO</span></td></tr>
      <tr><td>AUD-903</td><td>20/09/2026 11:20</td><td>Ajuste de Estoque por Quebra</td><td>Marcos Almoxarife</td><td>Avaria no transporte de 4 caixas 600ml</td><td><span class="status-pill pago">AUDITADO</span></td></tr>
    `;
  };

  const renderRelComprasGrid = () => {
    const tbody = document.getElementById('rel-compras-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td>NF-ENT-4401</td><td>20/09/2026</td><td>Ambev Distribuição</td><td>350 caixas / 20 barris</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 38.900,00</td><td><span class="status-pill ativo">ENTREGUE</span></td></tr>
      <tr><td>NF-ENT-4402</td><td>18/09/2026</td><td>Cervejaria Paulistana S/A</td><td>40 barris 50L</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 11.200,00</td><td><span class="status-pill ativo">ENTREGUE</span></td></tr>
      <tr><td>NF-ENT-4403</td><td>15/09/2026</td><td>Diageo Brasil</td><td>120 garrafas destilados</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 9.800,00</td><td><span class="status-pill ativo">ENTREGUE</span></td></tr>
    `;
  };

  const renderRelVariacaoGrid = () => {
    const tbody = document.getElementById('rel-variacao-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td>Barril 50L Pilsen Especial</td><td>R$ 260,00</td><td>R$ 280,00</td><td style="color:var(--status-danger); font-weight:700;">+ 7.69%</td><td>Ambev Distribuição</td></tr>
      <tr><td>Cerveja Lager 600ml (Cx 24)</td><td>R$ 84,00</td><td>R$ 89,50</td><td style="color:var(--status-danger); font-weight:700;">+ 6.54%</td><td>Ambev Distribuição</td></tr>
      <tr><td>Vodka Premium 1L</td><td>R$ 48,00</td><td>R$ 48,00</td><td style="color:var(--status-success); font-weight:700;">0.00% (Estável)</td><td>Diageo Brasil</td></tr>
    `;
  };

  const renderRelLucroGrid = () => {
    const tbody = document.getElementById('rel-lucro-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td>Barril 50L Pilsen Especial</td><td style="font-family:var(--font-mono);">R$ 280,00</td><td style="font-family:var(--font-mono);">R$ 395,00</td><td style="font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 115,00 (29.1%)</td><td>Alta Rotação</td></tr>
      <tr><td>Cerveja Lata Puro Malte (Fardo)</td><td style="font-family:var(--font-mono);">R$ 36,00</td><td style="font-family:var(--font-mono);">R$ 54,00</td><td style="font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 18,00 (33.3%)</td><td>Alta Rotação</td></tr>
      <tr><td>Whisky 12 Anos 1L</td><td style="font-family:var(--font-mono);">R$ 110,00</td><td style="font-family:var(--font-mono);">R$ 168,00</td><td style="font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 58,00 (34.5%)</td><td>Média Rotação</td></tr>
    `;
  };

  const renderRelDREGrid = () => {
    const dre = state.dreSummary;
    const revEl = document.getElementById('dre-rec-bruta');
    const dedEl = document.getElementById('dre-deducoes');
    const netEl = document.getElementById('dre-rec-liq');
    const cmvEl = document.getElementById('dre-cmv');
    const mbEl = document.getElementById('dre-margem-bruta');
    const opexEl = document.getElementById('dre-despesas-op');
    const resEl = document.getElementById('dre-resultado-liq');

    if (revEl) revEl.textContent = formatCurrency(dre.receitaBruta || 420500.00);
    if (dedEl) dedEl.textContent = `- ${formatCurrency(dre.deducoesImpostos || 48357.50)}`;
    if (netEl) netEl.textContent = formatCurrency(dre.receitaLiquida || 372142.50);
    if (cmvEl) cmvEl.textContent = `- ${formatCurrency(dre.cmv || 248900.00)}`;
    if (mbEl) mbEl.textContent = formatCurrency(dre.lucroBruto || 123242.50);
    if (opexEl) opexEl.textContent = `- ${formatCurrency(dre.despesasOperacionais || 48700.00)}`;
    if (resEl) resEl.textContent = formatCurrency(dre.lucroLiquido || 74542.50);
  };

  const renderRelFuncionariosGrid = () => {
    const tbody = document.getElementById('rel-funcionarios-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td><strong>Rodrigo Martins</strong></td><td>Consultor Comercial B2B</td><td>42 pedidos</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 184.200,00</td><td style="font-family:var(--font-mono); color:var(--status-success);">R$ 3.684,00 (2.0%)</td><td><span class="status-pill ativo">115% META</span></td></tr>
      <tr><td><strong>Juliana Silva</strong></td><td>Operadora Frente de Caixa</td><td>380 atendimentos</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 64.800,00</td><td style="font-family:var(--font-mono); color:var(--status-success);">R$ 648,00 (1.0%)</td><td><span class="status-pill ativo">102% META</span></td></tr>
      <tr><td><strong>Lucas Toledo</strong></td><td>Operador Frente de Caixa</td><td>310 atendimentos</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 52.400,00</td><td style="font-family:var(--font-mono); color:var(--status-success);">R$ 524,00 (1.0%)</td><td><span class="status-pill ativo">98% META</span></td></tr>
    `;
  };

  // =========================================================================
  // 8. FINANCEIRO (Pagar, Receber, Boletos & Previsão)
  // =========================================================================
  const renderFinanceiroGrid = () => {
    const tbody = document.getElementById('financeiro-pagar-tbody');
    const badge = document.getElementById('fin-tit-pendentes-badge');
    if (!tbody) return;

    tbody.innerHTML = '';
    const pendingCount = state.payableTitles.filter(t => t.status === 'aberto').length;
    if (badge) badge.textContent = `${pendingCount} Títulos a Vencer`;

    state.payableTitles.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono); font-size:12px;">${t.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--text-main); font-family:var(--font-mono); font-size:12px;">${t.invoiceRef}</div>
          <div style="font-size:10px; color:var(--text-dim); max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${t.nfeKey}">
            Chave: ${t.nfeKey}
          </div>
        </td>
        <td>
          <strong>${t.supplier}</strong>
        </td>
        <td style="color:var(--text-muted); font-size:11px;">${t.issueDate || '15/09/2026'}</td>
        <td style="color:var(--text-main); font-weight:600; font-size:11px;">${t.dueDate}</td>
        <td><span class="tag-badge tag-b2b" style="font-size:10px;">${t.category}</span></td>
        <td style="font-family:var(--font-mono); font-weight:700; font-size:13px; color:var(--text-main);">${formatCurrency(t.amount)}</td>
        <td style="font-family:var(--font-mono); font-size:10px; color:var(--text-dim); max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${t.barcode}">
          ${t.barcode}
        </td>
        <td>
          <span class="status-pill ${t.status === 'aberto' ? 'analise' : 'pago'}">
            ${t.status === 'aberto' ? 'EM ABERTO' : 'LIQUIDADO'}
          </span>
        </td>
        <td style="text-align:right;">
          ${t.status === 'aberto' ? `
            <button class="btn-secondary btn-liquidar-titulo" style="height:26px; padding:0 8px; font-size:11px; background:var(--status-success-bg); color:var(--status-success); border-color:var(--status-success-border);">
              ✓ Baixar Título
            </button>
          ` : `
            <span style="font-size:11px; color:var(--text-dim);">Liquidado</span>
          `}
        </td>
      `;

      const btnLiq = tr.querySelector('.btn-liquidar-titulo');
      if (btnLiq) {
        btnLiq.addEventListener('click', () => {
          t.status = 'pago';
          renderFinanceiroGrid();
          showToast(`✓ Título ${t.id} (${t.nfe} - ${t.supplier}) baixado e liquidado no financeiro!`, 'success');
        });
      }

      tbody.appendChild(tr);
    });
  };

  const renderFinancialBillsToReceiveGrid = () => {
    const tbody = document.getElementById('financeiro-receber-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.financialBillsToReceive.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${item.id}</strong></td>
        <td><strong>${item.client}</strong></td>
        <td><span style="font-family:var(--font-mono); font-size:11px;">${item.nfe}</span></td>
        <td style="color:var(--text-muted); font-size:11px;">${item.dueDate}</td>
        <td>${item.terms}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(item.value)}</td>
        <td><span class="status-pill ${item.status === 'aberto' ? 'vencer' : item.status === 'pago' ? 'pago' : 'rejeitada'}">${item.status.toUpperCase()}</span></td>
        <td style="text-align:right;">
          ${item.status === 'aberto' ? `
            <button class="btn-secondary btn-receber-titulo" style="height:26px; padding:0 8px; font-size:11px; background:var(--status-success-bg); color:var(--status-success); border-color:var(--status-success-border);">
              ✓ Registrar Recebimento
            </button>
          ` : `
            <span style="font-size:11px; color:var(--text-dim);">Recebido</span>
          `}
        </td>
      `;

      const btnRec = tr.querySelector('.btn-receber-titulo');
      if (btnRec) {
        btnRec.addEventListener('click', () => {
          item.status = 'pago';
          renderFinancialBillsToReceiveGrid();
          showToast(`Recebimento do título ${item.id} confirmado no banco!`, 'success');
        });
      }

      tbody.appendChild(tr);
    });
  };

  const renderFinancialBoletosGrid = () => {
    const tbody = document.getElementById('financeiro-boletos-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.financialBankBoletos.forEach(bol => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${bol.nossoNumero}</strong></td>
        <td><strong>${bol.sacado}</strong></td>
        <td>${bol.banco}</td>
        <td style="color:var(--text-muted); font-size:11px;">${bol.vencimento}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${formatCurrency(bol.valor)}</td>
        <td><span class="status-pill ${bol.status === 'registrado' ? 'pago' : 'analise'}">${bol.status.toUpperCase()}</span></td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button class="btn-secondary" style="height:26px; padding:0 8px; font-size:11px;" onclick="showToast('Baixando PDF do boleto com linha digitável e QR Code PIX...', 'info')">
              📥 PDF
            </button>
            <button class="btn-secondary" style="height:26px; padding:0 8px; font-size:11px;" onclick="showToast('Enviando boleto por e-mail para o cliente...', 'success')">
              ✉️ Enviar
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  const renderFinancialPrevisaoView = () => {
    const saldoAtual = 142850.00;
    const aReceber = state.financialBillsToReceive.filter(r => r.status === 'aberto').reduce((a, b) => a + b.value, 0);
    const aPagar = state.financialBillsToPay.filter(p => p.status === 'aberto').reduce((a, b) => a + b.value, 0);
    const saldoProjetado = saldoAtual + aReceber - aPagar;

    const elAtual = document.getElementById('prev-saldo-atual');
    const elRec = document.getElementById('prev-a-receber');
    const elPag = document.getElementById('prev-a-pagar');
    const elProj = document.getElementById('prev-saldo-projetado');

    if (elAtual) elAtual.textContent = formatCurrency(saldoAtual);
    if (elRec) elRec.textContent = formatCurrency(aReceber);
    if (elPag) elPag.textContent = formatCurrency(aPagar);
    if (elProj) elProj.textContent = formatCurrency(saldoProjetado);
  };

  // =========================================================================
  // 9. ADMIN (Gestão de Usuários & Matriz de Permissões)
  // =========================================================================
  const renderAdminUsuariosGrid = () => {
    const tbody = document.getElementById('admin-usuarios-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.systemUsers.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family:var(--font-mono);">${u.id}</strong></td>
        <td><strong>${u.name}</strong></td>
        <td><span style="font-family:var(--font-mono); font-size:11px;">${u.username}</span></td>
        <td>${u.email}</td>
        <td><span class="tag-badge ${u.role === 'Administrador' ? 'tag-b2b' : 'tag-b2c'}">${u.role}</span></td>
        <td>${u.lastLogin}</td>
        <td><span class="status-pill ${u.status === 'ativo' ? 'pago' : 'rejeitada'}">${u.status.toUpperCase()}</span></td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button class="btn-secondary btn-toggle-user" style="height:26px; padding:0 8px; font-size:11px;">
              ${u.status === 'ativo' ? 'Bloquear' : 'Ativar'}
            </button>
            <button class="btn-secondary" style="height:26px; padding:0 8px; font-size:11px;" onclick="showToast('Senha provisória enviada por e-mail para ${u.name}.', 'success')">
              🔑 Resetar Senha
            </button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-toggle-user').addEventListener('click', () => {
        u.status = u.status === 'ativo' ? 'inativo' : 'ativo';
        renderAdminUsuariosGrid();
        showToast(`Status do usuário ${u.name} alterado para ${u.status.toUpperCase()}.`, 'info');
      });

      tbody.appendChild(tr);
    });
  };

  const renderAdminPermissoesGrid = () => {
    const tbody = document.getElementById('admin-permissoes-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.systemPermissions.forEach(perm => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${perm.module}</strong></td>
        <td><span style="font-size:11px; color:var(--text-dim);">${perm.action}</span></td>
        <td style="text-align:center;"><input type="checkbox" ${perm.admin ? 'checked' : ''} disabled></td>
        <td style="text-align:center;"><input type="checkbox" ${perm.gerente ? 'checked' : ''} onchange="window.showToast('Permissão de Gerente atualizada.', 'info')"></td>
        <td style="text-align:center;"><input type="checkbox" ${perm.operador ? 'checked' : ''} onchange="window.showToast('Permissão de Operador atualizada.', 'info')"></td>
        <td style="text-align:center;"><input type="checkbox" ${perm.vendedor ? 'checked' : ''} onchange="window.showToast('Permissão de Vendedor atualizada.', 'info')"></td>
      `;
      tbody.appendChild(tr);
    });
  };

  // =========================================================================
  // 10. PDV VAREJO (Carrinho, Atalhos & Catálogo)
  // =========================================================================
  const calculateCartTotals = () => {
    let grossSubtotal = 0;
    let itemsDiscountTotal = 0;
    let totalItemsCount = 0;

    state.cart.forEach(item => {
      const itemPrice = item.customPrice !== undefined ? item.customPrice : item.product.price;
      const itemGross = item.quantity * itemPrice;
      grossSubtotal += itemGross;
      totalItemsCount += item.quantity;

      let itemDisc = 0;
      if (item.discountValue && item.discountValue > 0) {
        if (item.discountType === 'percentage') {
          itemDisc = itemGross * (item.discountValue / 100);
        } else {
          itemDisc = Math.min(itemGross, item.discountValue);
        }
      }
      itemsDiscountTotal += itemDisc;
    });

    const subtotalAfterItemDiscounts = Math.max(0, grossSubtotal - itemsDiscountTotal);

    let orderDiscountVal = 0;
    if (state.orderDiscount.value && state.orderDiscount.value > 0) {
      if (state.orderDiscount.type === 'percentage') {
        orderDiscountVal = subtotalAfterItemDiscounts * (state.orderDiscount.value / 100);
      } else {
        orderDiscountVal = Math.min(subtotalAfterItemDiscounts, state.orderDiscount.value);
      }
    }

    const totalDiscounts = itemsDiscountTotal + orderDiscountVal;
    const finalTotal = Math.max(0, grossSubtotal - totalDiscounts);

    return {
      grossSubtotal,
      itemsDiscountTotal,
      orderDiscountVal,
      totalDiscounts,
      finalTotal,
      totalItemsCount
    };
  };

  const renderPDVCart = () => {
    const tbody = document.getElementById('pdv-cart-items-tbody');
    const volumesEl = document.getElementById('cart-volumes-count');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const discountEl = document.getElementById('cart-discount-val');
    const finalTotalEl = document.getElementById('cart-final-total');
    if (!tbody) return;

    tbody.innerHTML = '';
    const totals = calculateCartTotals();

    if (state.cart.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-dim); padding: 48px 20px;">
            <div style="font-size: 28px; margin-bottom: 8px;">🛒</div>
            <strong style="font-size: 14px; color: var(--text-muted);">Nenhum item inserido no cupom fiscal</strong>
            <p style="font-size: 12px; margin-top: 4px;">Pressione <kbd style="background:var(--border-subtle); padding:2px 6px; border-radius:3px;">F2</kbd> para pesquisar ou use o leitor de código de barras</p>
          </td>
        </tr>
      `;
    } else {
      state.cart.forEach((item, index) => {
        const itemPrice = item.customPrice !== undefined ? item.customPrice : item.product.price;
        const itemGross = item.quantity * itemPrice;
        let itemDisc = 0;
        if (item.discountValue && item.discountValue > 0) {
          if (item.discountType === 'percentage') {
            itemDisc = itemGross * (item.discountValue / 100);
          } else {
            itemDisc = Math.min(itemGross, item.discountValue);
          }
        }
        const itemNet = Math.max(0, itemGross - itemDisc);

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="text-align: center; color: var(--text-dim); font-size: 11px;">${String(index + 1).padStart(2, '0')}</td>
          <td><span style="font-family: var(--font-mono); font-size: 11px;">${item.product.sku}</span></td>
          <td>
            <div style="font-weight: 600; color: var(--text-main); font-size: 12px;">${item.product.name}</div>
            <div style="font-size: 11px; color: var(--text-dim);">${item.product.category.toUpperCase()} • EAN: ${item.product.barcode}</div>
          </td>
          <td style="font-family: var(--font-mono); text-align: right;"><input type="number" step="0.01" class="input-editable pdv-price-input" data-index="${index}" value="${itemPrice.toFixed(2)}" style="width:70px; text-align:right;"></td>
          <td style="text-align: center;">
            <div class="qty-control-group" style="margin: 0 auto;">
              <button class="qty-btn btn-dec" data-index="${index}">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn btn-inc" data-index="${index}">+</button>
            </div>
          </td>
          <td style="text-align: center;">
            <button class="btn-secondary btn-edit-disc" data-index="${index}" style="height: 24px; padding: 0 8px; font-size: 11px; font-weight: 600; color: ${item.discountValue > 0 ? 'var(--status-success)' : 'var(--text-dim)'}; border-color: ${item.discountValue > 0 ? 'var(--status-success-border)' : 'var(--border-subtle)'}; background: ${item.discountValue > 0 ? 'var(--status-success-bg)' : 'transparent'};">
              ${item.discountValue > 0 ? (item.discountType === 'percentage' ? `${item.discountValue}%` : formatCurrency(item.discountValue)) : '0%'} ✏️
            </button>
          </td>
          <td style="font-family: var(--font-mono); font-weight: 700; text-align: right; color: var(--text-main);">${formatCurrency(itemNet)}</td>
          <td style="text-align: center;"><button class="btn-remove btn-del" data-index="${index}" title="Remover item">✕</button></td>
        `;

        tr.querySelector('.btn-dec').addEventListener('click', () => {
          if (item.quantity > 1) item.quantity -= 1;
          else state.cart.splice(index, 1);
          renderPDVCart();
        });

        const priceInput = tr.querySelector('.pdv-price-input');
        if (priceInput) {
          priceInput.addEventListener('change', (e) => {
            const newPrice = parseFloat(e.target.value);
            if (!isNaN(newPrice) && newPrice >= 0) {
              item.customPrice = newPrice;
              renderPDVCart();
            }
          });
        }

        tr.querySelector('.btn-inc').addEventListener('click', () => {
          item.quantity += 1;
          renderPDVCart();
        });

        tr.querySelector('.btn-del').addEventListener('click', () => {
          state.cart.splice(index, 1);
          renderPDVCart();
        });

        tr.querySelector('.btn-edit-disc').addEventListener('click', () => {
          openDiscountModal('item', index);
        });

        tbody.appendChild(tr);
      });
    }

    if (volumesEl) volumesEl.textContent = `${totals.totalItemsCount} un`;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.grossSubtotal);
    if (discountEl) discountEl.textContent = `- ${formatCurrency(totals.totalDiscounts)}`;
    if (finalTotalEl) finalTotalEl.textContent = formatCurrency(totals.finalTotal);
  };

  const addToCart = (product) => {
    const existingIndex = state.cart.findIndex(i => i.product.id === product.id);
    if (existingIndex >= 0) {
      state.cart[existingIndex].quantity += 1;
    } else {
      state.cart.push({
        product: product,
        quantity: 1,
        discountType: 'percentage',
        discountValue: 0
      });
    }

    renderPDVCart();
    showToast(`✓ ${product.name} adicionado ao cupom.`, 'success');
  };

  const renderPDVSearchAutocomplete = (query) => {
    const dropdown = document.getElementById('pdv-search-autocomplete');
    if (!dropdown) return;

    if (!query || query.trim().length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    const q = query.toLowerCase();
    const matched = state.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) || 
      p.barcode.includes(q)
    );

    if (matched.length === 0) {
      dropdown.innerHTML = `<div style="padding: 12px; font-size: 12px; color: var(--text-dim); text-align: center;">Nenhum produto localizado para "${query}"</div>`;
      dropdown.classList.add('active');
      return;
    }

    dropdown.innerHTML = '';
    matched.slice(0, 8).forEach(p => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `
        <div class="item-info">
          <div class="item-name">${p.name}</div>
          <div class="item-meta">SKU: <strong>${p.sku}</strong> • EAN: ${p.barcode} • Estoque: <strong>${p.stock} un</strong></div>
        </div>
        <div class="item-price">${formatCurrency(p.price)}</div>
      `;

      item.addEventListener('click', () => {
        addToCart(p);
        dropdown.classList.remove('active');
        const inp = document.getElementById('pdv-search-input');
        if (inp) {
          inp.value = '';
          inp.focus();
        }
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.add('active');
  };

  const renderCatalogModalProducts = () => {
    const tbody = document.getElementById('catalog-products-table-tbody');
    const counterBadge = document.getElementById('catalog-count-badge');
    if (!tbody) return;

    tbody.innerHTML = '';

    let prods = state.products.filter(p => {
      const matchCat = state.catalogSelectedCategory === 'all' || p.category === state.catalogSelectedCategory;
      const q = state.catalogSearchQuery.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q);
      return matchCat && matchSearch;
    });

    if (state.catalogSortBy === 'price-asc') prods.sort((a, b) => a.price - b.price);
    else if (state.catalogSortBy === 'price-desc') prods.sort((a, b) => b.price - a.price);
    else if (state.catalogSortBy === 'stock-asc') prods.sort((a, b) => a.stock - b.stock);
    else if (state.catalogSortBy === 'stock-desc') prods.sort((a, b) => b.stock - a.stock);
    else prods.sort((a, b) => a.name.localeCompare(b.name));

    if (counterBadge) counterBadge.textContent = `${prods.length} produtos`;

    if (prods.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-dim); padding: 32px;">Nenhum produto localizado com os filtros atuais.</td></tr>`;
      return;
    }

    prods.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family: var(--font-mono); font-size: 11px;">${p.sku}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-main); font-size: 12px;">${p.name}</div>
          <div style="font-size: 10px; color: var(--text-dim);">${p.supplier} • ${p.category.toUpperCase()}</div>
        </td>
        <td><span style="font-family: var(--font-mono); font-size: 11px;">${p.barcode}</span></td>
        <td style="color: var(--text-muted); font-size: 11px;">${p.registeredDate || '01/01/2025'}</td>
        <td style="font-family: var(--font-mono); text-align: right; color: var(--text-dim);">${formatCurrency(p.cost)}</td>
        <td style="font-family: var(--font-mono); text-align: right; font-weight: 700; color: var(--text-main);">${formatCurrency(p.price)}</td>
        <td style="text-align: center; font-family: var(--font-mono); font-weight: 700; color: ${p.stock <= p.minStock ? 'var(--status-danger)' : 'var(--text-main)'};">
          ${p.stock} un
        </td>
        <td style="text-align: right;">
          <button class="btn-primary-action btn-add-cat" style="height: 28px; padding: 0 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
            <span>+ Inserir</span>
          </button>
        </td>
      `;

      tr.querySelector('.btn-add-cat').addEventListener('click', () => {
        addToCart(p);
      });

      tbody.appendChild(tr);
    });
  };

  const openDiscountModal = (mode, itemIndex = null) => {
    state.discountModalTarget.mode = mode;
    state.discountModalTarget.itemIndex = itemIndex;

    const modal = document.getElementById('modal-discount');
    const tabItem = document.getElementById('tab-disc-item');
    const tabOrder = document.getElementById('tab-disc-order');
    const inputVal = document.getElementById('discount-input-val');
    const togglePercent = document.getElementById('btn-disc-percent');
    const toggleCurrency = document.getElementById('btn-disc-curr');

    if (mode === 'item' && itemIndex !== null) {
      const item = state.cart[itemIndex];
      tabItem.classList.add('active');
      tabOrder.classList.remove('active');
      state.discountModalTarget.type = item.discountType || 'percentage';
      inputVal.value = item.discountValue || '';
    } else {
      tabOrder.classList.add('active');
      tabItem.classList.remove('active');
      state.discountModalTarget.type = state.orderDiscount.type || 'percentage';
      inputVal.value = state.orderDiscount.value || '';
    }

    if (state.discountModalTarget.type === 'percentage') {
      togglePercent.classList.add('active');
      toggleCurrency.classList.remove('active');
    } else {
      toggleCurrency.classList.add('active');
      togglePercent.classList.remove('active');
    }

    updateDiscountPreview();
    modal.classList.add('active');
    setTimeout(() => inputVal.focus(), 80);
  };

  const updateDiscountPreview = () => {
    const inputVal = document.getElementById('discount-input-val');
    const val = parseFloat(inputVal.value) || 0;
    const type = state.discountModalTarget.type;

    let baseGross = 0;
    if (state.discountModalTarget.mode === 'item' && state.discountModalTarget.itemIndex !== null) {
      const it = state.cart[state.discountModalTarget.itemIndex];
      baseGross = it ? it.quantity * it.product.price : 0;
    } else {
      baseGross = calculateCartTotals().grossSubtotal;
    }

    let calculatedDiscount = 0;
    if (type === 'percentage') {
      calculatedDiscount = baseGross * (Math.min(100, val) / 100);
    } else {
      calculatedDiscount = Math.min(baseGross, val);
    }

    const netFinal = Math.max(0, baseGross - calculatedDiscount);

    document.getElementById('disc-prev-orig').textContent = formatCurrency(baseGross);
    document.getElementById('disc-prev-val').textContent = `- ${formatCurrency(calculatedDiscount)}`;
    document.getElementById('disc-prev-final').textContent = formatCurrency(netFinal);
  };

  const openSplitPaymentModal = () => {
    const totals = calculateCartTotals();
    if (totals.finalTotal <= 0 && state.cart.length === 0) {
      showToast('Adicione produtos ao cupom antes de finalizar a venda.', 'warning');
      return;
    }

    const modal = document.getElementById('modal-split-payment');
    document.getElementById('split-total-amount').textContent = formatCurrency(totals.finalTotal);

    const half = (totals.finalTotal / 2).toFixed(2);
    document.getElementById('split-val-pix').value = half;
    document.getElementById('split-val-tef').value = (totals.finalTotal - parseFloat(half)).toFixed(2);
    document.getElementById('split-val-cash').value = '0.00';
    document.getElementById('split-val-faturado').value = '0.00';

    updateSplitBalance();
    modal.classList.add('active');
  };

  const updateSplitBalance = () => {
    const totals = calculateCartTotals();
    const pix = parseFloat(document.getElementById('split-val-pix').value) || 0;
    const tef = parseFloat(document.getElementById('split-val-tef').value) || 0;
    const cash = parseFloat(document.getElementById('split-val-cash').value) || 0;
    const fat = parseFloat(document.getElementById('split-val-faturado').value) || 0;

    const sum = pix + tef + cash + fat;
    const diff = totals.finalTotal - sum;
    const balanceEl = document.getElementById('split-remaining-balance');

    if (Math.abs(diff) < 0.01) {
      balanceEl.innerHTML = `<span style="color: var(--status-success);">Total 100% coberto (${formatCurrency(sum)})</span>`;
    } else if (diff > 0) {
      balanceEl.innerHTML = `<span style="color: var(--status-warning);">Diferença restante: ${formatCurrency(diff)}</span>`;
    } else {
      balanceEl.innerHTML = `<span style="color: var(--status-danger);">Troco: ${formatCurrency(Math.abs(diff))}</span>`;
    }
  };

  const completeSaleAndEmitNFCe = () => {
    const totals = calculateCartTotals();
    const newNfeNumber = `000.084.${Math.floor(220 + Math.random() * 50)}`;

    const newInvoice = {
      id: `NF-${Date.now()}`,
      nfeNumber: newNfeNumber,
      serie: '1',
      date: new Date().toLocaleString('pt-BR'),
      type: 'NFC-e Mod 65',
      customer: 'Consumidor Final (Balcão)',
      customerType: 'b2c',
      itemsCount: state.cart.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: totals.finalTotal,
      paymentMethod: 'Split (PIX + TEF)',
      status: 'autorizada',
      statusText: 'Autorizada',
      protocol: `13526092${Math.floor(100000 + Math.random() * 900000)}`,
      xmlKey: `35260918342981000144550010000842201084220${Math.floor(100 + Math.random() * 900)}`,
      operator: 'Juliana Silva (PDV-02)',
      isCancellable: true,
      items: state.cart.map(i => ({
        name: i.product.name,
        qty: i.quantity,
        unitPrice: i.product.price,
        total: (i.product.price * i.quantity) - (i.discountValue || 0)
      }))
    };

    state.fiscalInvoices.unshift(newInvoice);
    state.cart = [];
    state.orderDiscount.value = 0;
    renderPDVCart();

    document.getElementById('modal-split-payment').classList.remove('active');
    showToast(`Venda finalizada! NFC-e nº ${newNfeNumber} autorizada pela Sefaz.`, 'success');
  };

  // =========================================================================
  // 11. B2B & ATACADO (Estoque Corporativo, Descontos & Histórico)
  // =========================================================================
  const renderB2BOrdersView = () => {
    const client = state.b2bClients.find(c => c.id === state.selectedB2BClientId) || state.b2bClients[0];
    
    const select = document.getElementById('b2b-order-client-select');
    if (select) {
      select.innerHTML = state.b2bClients.map(c => 
        `<option value="${c.id}" ${c.id === client.id ? 'selected' : ''}>${c.tradeName} - CNPJ: ${c.cnpj}</option>`
      ).join('');
    }

    const dl = document.getElementById('b2b-product-datalist');
    if (dl) {
      dl.innerHTML = state.products.map(p => {
        const stockAtacado = p.stockAtacado !== undefined ? p.stockAtacado : p.stock;
        const priceB2B = p.wholesalePrice || p.price;
        return `<option value="${p.id} - ${p.name}">Estoque: ${stockAtacado} | ${formatCurrency(priceB2B)}</option>`;
      }).join('');
    }

    const available = client.creditLimit - client.creditUsed;
    const percentUsed = Math.min(100, Math.round((client.creditUsed / client.creditLimit) * 100));

    document.getElementById('b2b-screen-credit-avail').textContent = formatCurrency(available);
    document.getElementById('b2b-screen-credit-total').textContent = `Total: ${formatCurrency(client.creditLimit)}`;
    document.getElementById('b2b-screen-credit-bar').style.width = `${percentUsed}%`;

    document.getElementById('vas-bal-b50').textContent = `${client.cascosBalance?.barril50 || 0} devidos`;
    document.getElementById('vas-bal-b30').textContent = `${client.cascosBalance?.barril30 || 0} devidos`;
    document.getElementById('vas-bal-cx600').textContent = `${client.cascosBalance?.caixas600 || 0} devidos`;
    document.getElementById('vas-bal-litro').textContent = `${client.cascosBalance?.caixasLitro || 0} devidos`;

    renderB2BItemsTable();
  };

  const updateB2BSelectedProductPackage = () => {
    const prodInput = document.getElementById('b2b-item-product-select');
    const pkgDisplay = document.getElementById('b2b-item-package-display');
    if (prodInput && pkgDisplay) {
      const pId = prodInput.value.split(' - ')[0];
      const p = state.products.find(x => x.id === pId);
      if (p) {
        pkgDisplay.value = p.wholesalePackage || p.vasilhameType || 'Fardo / Caixa';
      } else {
        pkgDisplay.value = '';
      }
    }
  };

  const addProductToB2BOrder = () => {
    const prodInput = document.getElementById('b2b-item-product-select');
    const qtyInput = document.getElementById('b2b-item-qty-input');
    const discInput = document.getElementById('b2b-item-discount-input');

    if (!prodInput || !qtyInput) return;

    const productId = prodInput.value.split(' - ')[0];
    const qty = parseInt(qtyInput.value) || 1;
    const discountPercent = Math.min(90, Math.max(0, parseFloat(discInput?.value) || 0));

    const product = state.products.find(p => p.id === productId);
    if (!product) {
      showToast('Selecione um produto válido.', 'warning');
      return;
    }

    const stockAtacado = product.stockAtacado !== undefined ? product.stockAtacado : product.stock;
    if (qty > stockAtacado) {
      showToast(`Atenção: Quantidade (${qty}) superior ao estoque de atacado disponível (${stockAtacado} un).`, 'warning');
    }

    const unitPrice = product.wholesalePrice || product.price;
    const packageUnit = product.wholesalePackage || product.vasilhameType || 'Fardo / Caixa';

    const existingIndex = state.b2bOrderCart.findIndex(item => item.product.id === product.id);
    if (existingIndex >= 0) {
      state.b2bOrderCart[existingIndex].quantity += qty;
      if (discountPercent > 0) {
        state.b2bOrderCart[existingIndex].discountType = 'percentage';
        state.b2bOrderCart[existingIndex].discountValue = discountPercent;
      }
    } else {
      state.b2bOrderCart.push({
        product: product,
        quantity: qty,
        unitPrice: unitPrice,
        discountType: discountPercent > 0 ? 'percentage' : 'percentage',
        discountValue: discountPercent,
        packageUnit: packageUnit
      });
    }

    qtyInput.value = 1;
    if (discInput) discInput.value = '';

    renderB2BItemsTable();
    showToast(`✓ ${qty}x ${product.name} (${packageUnit}) adicionado ao pedido B2B.`, 'success');
  };

  const openB2BProductHistory = (productId, productName) => {
    const client = state.b2bClients.find(c => c.id === state.selectedB2BClientId) || state.b2bClients[0];
    const modal = document.getElementById('modal-b2b-product-history');
    if (!modal) return;

    const titleEl = document.getElementById('b2b-prod-history-title');
    const subEl = document.getElementById('b2b-prod-history-subtitle');
    const totalQtyEl = document.getElementById('b2b-hist-total-qty');
    const totalValEl = document.getElementById('b2b-hist-total-val');
    const avgPriceEl = document.getElementById('b2b-hist-avg-price');
    const lastDiscEl = document.getElementById('b2b-hist-last-disc');
    const tbody = document.getElementById('b2b-prod-history-tbody');

    if (titleEl) titleEl.textContent = `Histórico de Compras • ${productName}`;
    if (subEl) subEl.textContent = `Empresa Selecionada: ${client.tradeName} (CNPJ: ${client.cnpj}) • Condição: ${client.paymentTerms}`;

    // Busca registros pré-cadastrados ou nos pedidos anteriores do cliente
    let historyRecords = [];
    const directMatch = state.b2bClientProductPurchaseHistory?.find(h => 
      h.clientId === client.id && (h.productId === productId || h.productName.toLowerCase().includes(productName.toLowerCase().substring(0, 6)))
    );

    if (directMatch && directMatch.history && directMatch.history.length > 0) {
      historyRecords = [...directMatch.history];
    } else {
      // Procura nos pedidos anteriores do cliente
      (client.ordersHistory || []).forEach(ord => {
        const matchedItem = ord.items?.find(it => it.name.toLowerCase().includes(productName.toLowerCase().substring(0, 6)));
        if (matchedItem) {
          const unitP = matchedItem.unitPrice || 100;
          const disc = matchedItem.discountPercent ? (unitP * (matchedItem.discountPercent / 100)) : 0;
          const netP = unitP - disc;
          historyRecords.push({
            orderId: ord.id,
            date: ord.date,
            nfe: ord.nfe,
            qty: matchedItem.qty,
            tablePrice: unitP,
            discountUnit: disc,
            netPrice: netP,
            total: matchedItem.qty * netP,
            status: ord.status || 'Entregue'
          });
        }
      });

      // Fallback rico e realista caso não haja histórico anterior
      if (historyRecords.length === 0) {
        historyRecords = [
          {
            orderId: 'PED-B2B-8910',
            date: '10/09/2026',
            nfe: '000.084.180',
            qty: 8,
            tablePrice: 395.00,
            discountUnit: 20.00,
            netPrice: 375.00,
            total: 3000.00,
            status: 'Liquidado'
          },
          {
            orderId: 'PED-B2B-8822',
            date: '25/08/2026',
            nfe: '000.084.112',
            qty: 12,
            tablePrice: 395.00,
            discountUnit: 15.00,
            netPrice: 380.00,
            total: 4560.00,
            status: 'Liquidado'
          }
        ];
      }
    }

    let sumQty = 0;
    let sumVal = 0;
    let lastDiscountText = 'R$ 0,00 (0%)';

    if (tbody) tbody.innerHTML = '';

    historyRecords.forEach((rec, idx) => {
      sumQty += rec.qty;
      sumVal += rec.total;
      if (idx === 0) {
        const discPct = rec.tablePrice > 0 ? ((rec.discountUnit / rec.tablePrice) * 100).toFixed(1) : '0.0';
        lastDiscountText = rec.discountUnit > 0 ? `${formatCurrency(rec.discountUnit)} / un (${discPct}%)` : 'Sem desconto';
      }

      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong style="font-family:var(--font-mono); font-size:12px;">${rec.orderId}</strong></td>
          <td style="color:var(--text-muted); font-size:11px;">${rec.date}</td>
          <td style="font-family:var(--font-mono); font-weight:700; text-align:center;">${rec.qty} un</td>
          <td style="font-family:var(--font-mono); text-align:right; color:var(--text-dim);">${formatCurrency(rec.tablePrice)}</td>
          <td style="font-family:var(--font-mono); text-align:right; color:${rec.discountUnit > 0 ? 'var(--status-success)' : 'var(--text-dim)'}; font-weight:600;">
            ${rec.discountUnit > 0 ? `- ${formatCurrency(rec.discountUnit)}` : 'R$ 0,00'}
          </td>
          <td style="font-family:var(--font-mono); text-align:right; font-weight:700; color:var(--text-main);">${formatCurrency(rec.netPrice)}</td>
          <td style="font-family:var(--font-mono); text-align:right; font-weight:800; color:var(--b2b-purple);">${formatCurrency(rec.total)}</td>
          <td><span class="tag-badge tag-b2b" style="font-size:10px;">${rec.nfe}</span></td>
          <td><span class="status-pill pago" style="font-size:10px;">${rec.status.toUpperCase()}</span></td>
        `;
        tbody.appendChild(tr);
      }
    });

    const avgPrice = sumQty > 0 ? (sumVal / sumQty) : 0;

    if (totalQtyEl) totalQtyEl.textContent = `${sumQty} unidades`;
    if (totalValEl) totalValEl.textContent = formatCurrency(sumVal);
    if (avgPriceEl) avgPriceEl.textContent = `${formatCurrency(avgPrice)} / un`;
    if (lastDiscEl) lastDiscEl.textContent = lastDiscountText;

    modal.classList.add('active');
  };

  window.openB2BProductHistory = openB2BProductHistory;

  const renderB2BItemsTable = () => {
    const tbody = document.getElementById('b2b-order-items-tbody');
    const subtotalEl = document.getElementById('b2b-screen-subtotal');
    const itemsDiscEl = document.getElementById('b2b-screen-items-discount');
    const globalDiscEl = document.getElementById('b2b-screen-global-discount');
    const totalEl = document.getElementById('b2b-screen-order-total');
    if (!tbody) return;

    tbody.innerHTML = '';
    let grossSubtotal = 0;
    let itemsDiscountSum = 0;

    if (state.b2bOrderCart.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-dim); padding: 28px;">
            Nenhum produto inserido no pedido B2B. Utilize o seletor acima para adicionar itens de atacado.
          </td>
        </tr>
      `;
      if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
      if (itemsDiscEl) itemsDiscEl.textContent = '- R$ 0,00';
      if (globalDiscEl) globalDiscEl.textContent = '- R$ 0,00';
      if (totalEl) totalEl.textContent = 'R$ 0,00';
      return;
    }

    state.b2bOrderCart.forEach((item, index) => {
      const lineGross = item.quantity * item.unitPrice;
      grossSubtotal += lineGross;

      let lineDiscount = 0;
      if (item.discountValue && item.discountValue > 0) {
        if (item.discountType === 'percentage') {
          lineDiscount = lineGross * (item.discountValue / 100);
        } else {
          lineDiscount = Math.min(lineGross, item.discountValue);
        }
      }
      itemsDiscountSum += lineDiscount;
      const lineNet = Math.max(0, lineGross - lineDiscount);

      const pkgName = item.packageUnit || item.product.wholesalePackage || item.product.vasilhameType || 'Embalagem Atacado';
      const stockAtacado = item.product.stockAtacado !== undefined ? item.product.stockAtacado : item.product.stock;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:12px; color:var(--text-main);">${item.product.name}</div>
            <button type="button" class="btn-secondary btn-open-prod-hist" data-index="${index}" style="height:22px; font-size:10px; padding:0 6px; color:var(--b2b-purple); border-color:var(--b2b-purple-border); background:var(--b2b-purple-light); display:inline-flex; align-items:center; gap:3px; font-weight:600;" title="Ver histórico de compras deste produto por este cliente">
              📊 Histórico Cliente
            </button>
          </div>
          <div style="font-size:11px; color:var(--b2b-purple); font-weight:600; display:flex; gap:6px; align-items:center; margin-top:3px;">
            <span class="tag-badge tag-b2b" style="font-size:10px; padding:1px 6px;">📦 ${pkgName}</span>
            <span style="color:var(--text-dim); font-size:10px;">Estoque B2B: ${stockAtacado} un</span>
          </div>
        </td>
        <td style="text-align:center;">
          <div class="qty-control-group" style="margin:0 auto;">
            <button class="qty-btn b2b-dec" data-index="${index}" type="button">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn b2b-inc" data-index="${index}" type="button">+</button>
          </div>
        </td>
        <td style="font-family:var(--font-mono); text-align:right;"><input type="number" step="0.01" class="input-editable b2b-price-input" data-index="${index}" value="${item.unitPrice.toFixed(2)}" style="width:70px; text-align:right;"></td>
        <td style="text-align:center;">
          <button class="btn-secondary b2b-edit-disc-btn" data-index="${index}" style="height:24px; padding:0 8px; font-size:11px; font-weight:600; color:${item.discountValue > 0 ? 'var(--status-success)' : 'var(--text-dim)'}; border-color:${item.discountValue > 0 ? 'var(--status-success-border)' : 'var(--border-subtle)'}; background:${item.discountValue > 0 ? 'var(--status-success-bg)' : 'transparent'};">
            ${item.discountValue > 0 ? (item.discountType === 'percentage' ? `${item.discountValue}%` : formatCurrency(item.discountValue)) : '0%'} ✏️
          </button>
        </td>
        <td style="font-family:var(--font-mono); font-weight:700; text-align:right; color:var(--text-main);">${formatCurrency(lineNet)}</td>
        <td style="text-align:center;"><button class="btn-remove b2b-del" data-index="${index}" title="Remover item">✕</button></td>
      `;

      tr.querySelector('.btn-open-prod-hist').addEventListener('click', () => {
        openB2BProductHistory(item.product.id, item.product.name);
      });

      tr.querySelector('.b2b-dec').addEventListener('click', () => {
        if (item.quantity > 1) item.quantity -= 1;
        else state.b2bOrderCart.splice(index, 1);
        renderB2BItemsTable();
      });

      tr.querySelector('.b2b-inc').addEventListener('click', () => {
        item.quantity += 1;
        renderB2BItemsTable();
      });

      const priceInput = tr.querySelector('.b2b-price-input');
      if (priceInput) {
        priceInput.addEventListener('change', (e) => {
          const newPrice = parseFloat(e.target.value);
          if (!isNaN(newPrice) && newPrice >= 0) {
            item.unitPrice = newPrice;
            renderB2BItemsTable();
          }
        });
      }

      tr.querySelector('.b2b-del').addEventListener('click', () => {
        state.b2bOrderCart.splice(index, 1);
        renderB2BItemsTable();
      });

      tr.querySelector('.b2b-edit-disc-btn').addEventListener('click', () => {
        const currentVal = item.discountValue || 0;
        const promptVal = prompt(`Defina a % de desconto para ${item.product.name} (0 a 90%):`, currentVal);
        if (promptVal !== null) {
          const parsed = parseFloat(promptVal);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 90) {
            item.discountType = 'percentage';
            item.discountValue = parsed;
            renderB2BItemsTable();
            showToast(`Desconto de ${parsed}% aplicado ao item ${item.product.name}.`, 'info');
          }
        }
      });

      tbody.appendChild(tr);
    });

    const subtotalAfterItemsDisc = Math.max(0, grossSubtotal - itemsDiscountSum);
    let globalDiscountVal = 0;
    const globalType = document.getElementById('b2b-global-disc-type')?.value || state.b2bOrderDiscount.type || 'percent';
    const globalInputVal = parseFloat(document.getElementById('b2b-global-disc-val')?.value) || state.b2bOrderDiscount.value || 0;

    if (globalInputVal > 0) {
      if (globalType === 'percent') {
        globalDiscountVal = subtotalAfterItemsDisc * (Math.min(90, globalInputVal) / 100);
      } else {
        globalDiscountVal = Math.min(subtotalAfterItemsDisc, globalInputVal);
      }
    }

    const finalTotal = Math.max(0, subtotalAfterItemsDisc - globalDiscountVal);

    if (subtotalEl) subtotalEl.textContent = formatCurrency(grossSubtotal);
    if (itemsDiscEl) itemsDiscEl.textContent = `- ${formatCurrency(itemsDiscountSum)}`;
    if (globalDiscEl) globalDiscEl.textContent = `- ${formatCurrency(globalDiscountVal)}`;
    if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
  };

  const openRepeatOrderModalB2B = () => {
    const client = state.b2bClients.find(c => c.id === state.selectedB2BClientId) || state.b2bClients[0];
    const modal = document.getElementById('modal-repeat-b2b-order');
    const container = document.getElementById('repeat-orders-list-container');
    const subtitle = document.getElementById('repeat-order-modal-subtitle');
    if (!modal || !container) return;

    if (subtitle) {
      subtitle.textContent = `Cliente: ${client.tradeName} (${client.cnpj}) • Escolha um dos pedidos anteriores para clonar no carrinho B2B.`;
    }

    container.innerHTML = '';

    if (!client.ordersHistory || client.ordersHistory.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:36px 20px; color:var(--text-dim); background:var(--bg-surface-subtle); border:1px dashed var(--border-color); border-radius:var(--radius-xs);">
          <div style="font-size:32px; margin-bottom:8px;">📦</div>
          <h4 style="color:var(--text-main); font-size:14px; margin-bottom:4px;">Nenhum pedido anterior registrado</h4>
          <p style="font-size:12px;">Esta empresa ainda não possui histórico de pedidos anteriores para repetição.</p>
        </div>
      `;
      modal.classList.add('active');
      return;
    }

    client.ordersHistory.forEach(order => {
      const card = document.createElement('div');
      card.className = 'b2b-history-order-card';
      card.style.cssText = 'background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-xs); padding:14px 16px; display:flex; flex-direction:column; gap:10px; transition:border-color 0.2s; box-shadow:var(--shadow-xs);';

      const itemsSummary = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <strong style="font-family:var(--font-mono); font-size:13px; color:var(--text-main);">${order.id}</strong>
            <span class="tag-badge tag-b2b" style="font-size:10px;">NF-e: ${order.nfe || 'Emitida'}</span>
            <span class="status-pill ${order.status?.toLowerCase().includes('liquidado') || order.status?.toLowerCase().includes('entregue') ? 'pago' : 'analise'}" style="font-size:10px;">
              ${order.status || 'Finalizado'}
            </span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">
            Data: <strong>${order.date}</strong>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="flex:1; padding-right:16px;">
            <div style="font-size:11px; color:var(--text-dim); margin-bottom:2px;">Itens do Pedido (${order.items.length} produtos / ${order.itemsCount || order.items.reduce((a, b) => a + b.qty, 0)} volumes):</div>
            <div style="font-size:12px; color:var(--text-main); font-weight:500; line-height:1.4;">${itemsSummary}</div>
          </div>
          
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
            <div style="font-size:16px; font-weight:800; font-family:var(--font-mono); color:var(--b2b-purple);">
              ${formatCurrency(order.total)}
            </div>
            <button class="btn-add-client btn-load-past-order" style="height:32px; padding:0 12px; font-size:11px; background:var(--b2b-purple); gap:4px;" type="button">
              🔄 Repetir Este Pedido
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-load-past-order').addEventListener('click', () => {
        loadPastOrderIntoB2BCart(order);
        modal.classList.remove('active');
      });

      container.appendChild(card);
    });

    modal.classList.add('active');
  };

  const loadPastOrderIntoB2BCart = (order) => {
    state.b2bOrderCart = order.items.map(i => {
      const prod = state.products.find(p => p.name.toLowerCase().includes(i.name.toLowerCase().substring(0, 8))) || state.products[0];
      const unitPrice = i.unitPrice || prod.wholesalePrice || prod.price;
      const pkg = prod.wholesalePackage || prod.vasilhameType || 'Fardo / Caixa';
      return {
        product: prod,
        quantity: i.qty,
        unitPrice: unitPrice,
        discountType: 'percentage',
        discountValue: 0,
        packageUnit: pkg
      };
    });

    renderB2BItemsTable();
    showToast(`✓ Todos os itens do pedido (${order.id}) foram carregados no carrinho B2B!`, 'success');
  };

  window.transmitirPedidoB2B = () => {
    if (state.b2bOrderCart.length === 0) {
      showToast('Adicione produtos de atacado antes de gerar o pedido B2B.', 'warning');
      return;
    }

    const client = state.b2bClients.find(c => c.id === state.selectedB2BClientId);
    const newOrderNum = `PED-B2B-${Math.floor(8950 + Math.random() * 50)}`;
    const newNfe = `000.084.${Math.floor(220 + Math.random() * 50)}`;

    let grossSubtotal = 0;
    let itemsDiscountSum = 0;
    state.b2bOrderCart.forEach(item => {
      const gross = item.quantity * item.unitPrice;
      grossSubtotal += gross;
      if (item.discountValue && item.discountValue > 0) {
        if (item.discountType === 'percentage') {
          itemsDiscountSum += gross * (item.discountValue / 100);
        } else {
          itemsDiscountSum += Math.min(gross, item.discountValue);
        }
      }
    });

    const subtotalAfterItemsDisc = Math.max(0, grossSubtotal - itemsDiscountSum);
    const globalType = document.getElementById('b2b-global-disc-type')?.value || 'percent';
    const globalInputVal = parseFloat(document.getElementById('b2b-global-disc-val')?.value) || 0;
    let globalDiscountVal = 0;
    if (globalInputVal > 0) {
      if (globalType === 'percent') {
        globalDiscountVal = subtotalAfterItemsDisc * (Math.min(90, globalInputVal) / 100);
      } else {
        globalDiscountVal = Math.min(subtotalAfterItemsDisc, globalInputVal);
      }
    }

    const finalTotal = Math.max(0, subtotalAfterItemsDisc - globalDiscountVal);

    state.b2bOrderCart.forEach(item => {
      if (item.product.stockAtacado !== undefined) {
        item.product.stockAtacado = Math.max(0, item.product.stockAtacado - item.quantity);
      }
      item.product.stock = Math.max(0, item.product.stock - item.quantity);
    });

    const newOrderObj = {
      id: newOrderNum,
      nfe: newNfe,
      date: new Date().toLocaleDateString('pt-BR'),
      total: finalTotal,
      status: 'Aprovado / Em Separação',
      paymentStatus: client.paymentTerms || 'Faturado 15/30 DDL',
      itemsCount: state.b2bOrderCart.reduce((acc, i) => acc + i.quantity, 0),
      items: state.b2bOrderCart.map(i => ({
        name: i.product.name,
        qty: i.quantity,
        unitPrice: i.unitPrice,
        packageUnit: i.packageUnit,
        discountPercent: i.discountValue || 0,
        total: i.quantity * i.unitPrice * (1 - ((i.discountValue || 0) / 100))
      }))
    };

    if (!client.ordersHistory) client.ordersHistory = [];
    client.ordersHistory.unshift(newOrderObj);
    client.totalPurchases = (client.totalPurchases || 0) + finalTotal;
    client.ordersCount = (client.ordersCount || 0) + 1;
    client.creditUsed += finalTotal;

    state.fiscalInvoices.unshift({
      id: `NF-${Date.now()}`,
      nfeNumber: newNfe,
      serie: '1',
      date: new Date().toLocaleString('pt-BR'),
      type: 'NF-e Mod 55',
      customer: client.corporateName,
      customerType: 'b2b',
      itemsCount: newOrderObj.itemsCount,
      totalAmount: finalTotal,
      paymentMethod: client.paymentTerms,
      status: 'autorizada',
      statusText: 'Autorizada',
      protocol: `13526092${Math.floor(100000 + Math.random() * 900000)}`,
      xmlKey: `35260918342981000144550010000842201084220${Math.floor(100 + Math.random() * 900)}`,
      operator: 'Rodrigo Martins (Comercial B2B)',
      isCancellable: true,
      items: newOrderObj.items
    });

    state.b2bOrderCart = [];
    const discValInput = document.getElementById('b2b-global-disc-val');
    if (discValInput) discValInput.value = 0;

    renderB2BOrdersView();
    showToast(`Pedido B2B ${newOrderNum} gerado com sucesso! NF-e nº ${newNfe} autorizada e estoque de atacado atualizado.`, 'success');
  };

  // DANFE Viewer
  const openDANFEViewer = (inv) => {
    const modal = document.getElementById('modal-danfe-viewer');
    const container = document.getElementById('danfe-document-container');
    if (!modal || !container) return;

    const itemsRows = (inv.items || []).map(i => `
      <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:2px;">
        <span>${i.qty}x ${i.name}</span>
        <span>${formatCurrency(i.total || (i.qty * i.unitPrice))}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="danfe-receipt-box">
        <div style="text-align:center; border-bottom:1px dashed #000; padding-bottom:8px; margin-bottom:8px;">
          <strong style="font-size:13px;">ATACAREJO/CBA DISTRIBUIDORA LTDA</strong><br>
          CNPJ: 18.342.981/0001-44 • IE: 112.984.771.110<br>
          Av. das Nações Unidas, 12901 - Brooklin - SP
        </div>

        <div style="text-align:center; font-weight:700; margin-bottom:6px;">
          DANFE SIMPLIFICADA - DOCUMENTO AUXILIAR<br>
          ${inv.type || 'NFC-e / NF-e'}
        </div>

        <div style="font-size:10px; margin-bottom:8px; border-bottom:1px dashed #000; padding-bottom:6px;">
          Número: <strong>${inv.nfeNumber}</strong> &nbsp; Série: <strong>1</strong><br>
          Emissão: <strong>${inv.date}</strong><br>
          Cliente: <strong>${inv.customer}</strong>
        </div>

        <div style="margin-bottom:8px; border-bottom:1px dashed #000; padding-bottom:6px;">
          <div style="font-size:10px; font-weight:700; margin-bottom:4px;">ITENS DA NOTA:</div>
          ${itemsRows || '<div style="font-size:10px;">Diversos itens de bebidas autorizados</div>'}
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; border-bottom:1px dashed #000; padding-bottom:8px; margin-bottom:8px;">
          <span>VALOR TOTAL:</span>
          <span>${formatCurrency(inv.totalAmount)}</span>
        </div>

        <div class="danfe-barcode-mock"></div>

        <div style="font-size:9px; text-align:center; word-break:break-all; color:#475569;">
          CHAVE DE ACESSO:<br>
          ${inv.xmlKey || '35260918342981000144550010000842201084220119'}<br>
          PROTOCOLO SEFAZ: ${inv.protocol || '13526092894101'}
        </div>
      </div>
    `;

    modal.classList.add('active');
  };

  window.viewSaleDANFE = (saleId) => {
    const sale = state.reportsData.detailedSales.find(s => s.saleId === saleId);
    if (!sale) return;
    openDANFEViewer({
      nfeNumber: sale.saleId.replace('VND-', 'NFE-'),
      date: sale.timestamp,
      type: sale.type === 'b2b' ? 'NF-e Mod 55' : 'NFC-e Mod 65',
      customer: sale.client,
      totalAmount: sale.netTotal,
      protocol: sale.nfeInfo.protocol,
      xmlKey: sale.nfeInfo.key,
      items: sale.items
    });
  };

  const openFiscalCancelModal = (inv) => {
    state.selectedFiscalInvoiceForCancel = inv;
    const modal = document.getElementById('modal-cancel-fiscal');
    document.getElementById('cancel-fiscal-nfe-num').textContent = inv.nfeNumber;
    document.getElementById('cancel-fiscal-customer').textContent = inv.customer;
    document.getElementById('cancel-fiscal-value').textContent = formatCurrency(inv.totalAmount);
    selectCancelStrategy('note-only');
    modal.classList.add('active');
  };

  const selectCancelStrategy = (strat) => {
    state.cancelStrategySelected = strat;
    const card1 = document.getElementById('cancel-card-note-only');
    const card2 = document.getElementById('cancel-card-note-and-sale');

    if (strat === 'note-only') {
      if (card1) card1.classList.add('selected');
      if (card2) card2.classList.remove('selected');
    } else {
      if (card2) card2.classList.add('selected');
      if (card1) card1.classList.remove('selected');
    }
  };

  const executeFiscalCancellation = () => {
    const inv = state.selectedFiscalInvoiceForCancel;
    const reason = document.getElementById('cancel-fiscal-justificativa').value.trim();

    if (!reason || reason.length < 15) {
      showToast('A justificativa da Sefaz deve ter pelo menos 15 caracteres.', 'danger');
      return;
    }

    inv.status = 'cancelada';
    inv.statusText = 'Cancelada';
    inv.isCancellable = false;

    document.getElementById('modal-cancel-fiscal').classList.remove('active');
    renderFiscalGrid();
    showToast(`✓ NF-e nº ${inv.nfeNumber} cancelada perante a Sefaz. Protocolo de evento gerado.`, 'success');
  };

  const openOrderDetailsModal = (client, order) => {
    const modal = document.getElementById('modal-order-details');
    const title = document.getElementById('order-detail-title');
    const meta = document.getElementById('order-detail-meta');
    const tbody = document.getElementById('order-detail-items-tbody');
    const subtotalEl = document.getElementById('order-detail-subtotal');
    const totalEl = document.getElementById('order-detail-total');
    const nfeKeyEl = document.getElementById('order-detail-nfe-key');
    const danfeBtn = document.getElementById('btn-order-detail-danfe');
    if (!modal) return;

    title.textContent = `Detalhamento do Pedido ${order.id}`;
    meta.textContent = `Cliente: ${client.tradeName} • NF-e: ${order.nfe} • Data: ${order.date} • Status: ${order.status}`;

    tbody.innerHTML = '';
    (order.items || []).forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td style="text-align: center;">${item.qty} un</td>
        <td style="text-align: right; font-family: var(--font-mono);">${formatCurrency(item.unitPrice || (item.total / item.qty))}</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">${formatCurrency(item.total)}</td>
      `;
      tbody.appendChild(tr);
    });

    subtotalEl.textContent = formatCurrency(order.total);
    totalEl.textContent = formatCurrency(order.total);
    nfeKeyEl.textContent = `35260918342981000144550010000842${order.nfe.replace(/\D/g, '')}1084220`;

    danfeBtn.onclick = () => {
      modal.classList.remove('active');
      openDANFEViewer({
        nfeNumber: order.nfe,
        date: order.date,
        type: 'NF-e Mod 55',
        customer: client.corporateName,
        totalAmount: order.total,
        protocol: '13526092894101',
        xmlKey: `35260918342981000144550010000842${order.nfe.replace(/\D/g, '')}`,
        items: order.items || []
      });
    };

    modal.classList.add('active');
  };

  // =========================================================================
  // 0. DASHBOARD GERAL RESUMIDO (Visão Executiva em Tempo Real)
  // =========================================================================
  const renderDashboardGeralView = () => {
    // Totais diários PDV e B2B
    const totalPdv = 16970.00;
    const totalB2b = 36240.00;
    const totalGeral = totalPdv + totalB2b;
    const totalQuotes = state.quotes.filter(q => q.status === 'pendente').reduce((a, b) => a + b.total, 0);

    const elTotal = document.getElementById('dash-total-vendas-hoje');
    const elPdv = document.getElementById('dash-vendas-pdv-hoje');
    const elB2b = document.getElementById('dash-vendas-b2b-hoje');
    const elQuotes = document.getElementById('dash-orcamentos-total');
    const elStockAlertCount = document.getElementById('dash-stock-alert-count');
    const tbodyStock = document.getElementById('dash-stock-critical-tbody');

    if (elTotal) elTotal.textContent = formatCurrency(totalGeral);
    if (elPdv) elPdv.textContent = formatCurrency(totalPdv);
    if (elB2b) elB2b.textContent = formatCurrency(totalB2b);
    if (elQuotes) elQuotes.textContent = formatCurrency(totalQuotes || 24500.00);

    // Produtos com estoque crítico (<= mínimo)
    const criticalProds = state.products.filter(p => p.stock <= p.minStock);
    if (elStockAlertCount) elStockAlertCount.textContent = `${criticalProds.length} Itens Críticos`;

    if (tbodyStock) {
      tbodyStock.innerHTML = '';
      if (criticalProds.length === 0) {
        tbodyStock.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-dim); padding:20px;">✓ Todos os produtos estão com estoque acima do nível de segurança.</td></tr>`;
      } else {
        criticalProds.slice(0, 6).forEach(p => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong style="font-family:var(--font-mono); font-size:11px;">${p.sku}</strong></td>
            <td>
              <strong>${p.name}</strong><br>
              <small style="color:var(--text-dim); font-size:10px;">${p.supplier}</small>
            </td>
            <td><span class="tag-badge ${p.type === 'b2b' ? 'tag-b2b' : 'tag-b2c'}">${p.category.toUpperCase()}</span></td>
            <td style="font-family:var(--font-mono); font-weight:800; color:var(--status-danger); text-align:center;">${p.stock} un</td>
            <td style="font-family:var(--font-mono); color:var(--text-dim); text-align:center;">${p.minStock} un</td>
            <td><span class="status-pill rejeitada" style="font-size:10px;">RUPTURA</span></td>
            <td style="text-align:right;">
              <button class="btn-secondary btn-dash-repor" style="height:24px; padding:0 8px; font-size:10px; background:var(--status-warning-bg); color:var(--status-warning); border-color:var(--status-warning-border);">
                ⚡ Repor
              </button>
            </td>
          `;

          tr.querySelector('.btn-dash-repor').addEventListener('click', () => {
            showToast(`Solicitação de compra gerada para ${p.name}!`, 'success');
            handleSubmenuNavigation('view-compras-sugestao', '- Sugestão de compra');
          });

          tbodyStock.appendChild(tr);
        });
      }
    }

    // Gráfico de Barras Semanal
    const chartBarsContainer = document.getElementById('dash-weekly-chart-bars');
    if (chartBarsContainer) {
      const daysData = [
        { day: 'Seg', pdv: 12400, b2b: 28900 },
        { day: 'Ter', pdv: 14100, b2b: 31200 },
        { day: 'Qua', pdv: 15800, b2b: 34500 },
        { day: 'Qui', pdv: 18900, b2b: 42100 },
        { day: 'Sex', pdv: 24500, b2b: 58900 },
        { day: 'Sáb', pdv: 29800, b2b: 48500 },
        { day: 'Dom', pdv: 16970, b2b: 36240 }
      ];

      const maxVal = 65000;
      chartBarsContainer.innerHTML = daysData.map(d => {
        const pdvHeight = Math.round((d.pdv / maxVal) * 100);
        const b2bHeight = Math.round((d.b2b / maxVal) * 100);
        const totalDay = formatCurrency(d.pdv + d.b2b);
        return `
          <div class="dash-chart-bar-col" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%;" title="${d.day}: Total ${totalDay}">
            <div style="flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; gap:4px;">
              <div style="width:14px; height:${pdvHeight}%; background:var(--b2c-blue); border-radius:3px 3px 0 0;" title="PDV: ${formatCurrency(d.pdv)}"></div>
              <div style="width:14px; height:${b2bHeight}%; background:var(--b2b-purple); border-radius:3px 3px 0 0;" title="B2B: ${formatCurrency(d.b2b)}"></div>
            </div>
            <span style="font-size:10px; font-weight:700; color:var(--text-dim);">${d.day}</span>
          </div>
        `;
      }).join('');
    }

    // Mini Lista de Contas a Pagar Vinculadas às Notas
    const payableMiniList = document.getElementById('dash-payable-mini-list');
    if (payableMiniList) {
      payableMiniList.innerHTML = state.payableTitles.slice(0, 3).map(t => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); padding:8px 10px; border-radius:var(--radius-xs);">
          <div>
            <div style="font-weight:700; font-size:11px; color:var(--text-main);">${t.supplier}</div>
            <div style="font-size:10px; color:var(--text-dim);">NF: <strong>${t.nfe}</strong> • Venc: ${t.dueDate}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-weight:700; font-size:12px; color:var(--status-danger);">${formatCurrency(t.value)}</div>
            <span class="status-pill ${t.status === 'aberto' ? 'analise' : 'pago'}" style="font-size:9px; padding:1px 5px;">${t.status.toUpperCase()}</span>
          </div>
        </div>
      `).join('');
    }

    // Mini Lista de Emissões Fiscais
    const fiscalMiniList = document.getElementById('dash-fiscal-mini-list');
    if (fiscalMiniList) {
      fiscalMiniList.innerHTML = state.fiscalInvoices.slice(0, 3).map(inv => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); padding:8px 10px; border-radius:var(--radius-xs);">
          <div>
            <div style="font-weight:700; font-size:11px; color:var(--text-main); font-family:var(--font-mono);">${inv.nfeNumber}</div>
            <div style="font-size:10px; color:var(--text-dim);">${inv.customer}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-weight:700; font-size:12px;">${formatCurrency(inv.totalAmount)}</div>
            <span class="status-pill ${inv.status}" style="font-size:9px; padding:1px 5px;">${inv.statusText || inv.status.toUpperCase()}</span>
          </div>
        </div>
      `).join('');
    }
  };

  // =========================================================================
  // 7. RELATÓRIOS • PAINEL DINÂMICO MULTI-RELATÓRIOS LADO A LADO
  // =========================================================================
  const reportTemplates = {
    vendas_categoria: {
      id: 'vendas_categoria',
      title: '📊 Vendas por Categoria',
      tag: 'Comercial',
      render: () => `
        <table class="enterprise-table" style="font-size:11px;">
          <thead>
            <tr><th>Categoria</th><th>Volumes</th><th>Faturamento</th><th style="text-align:right;">Part. %</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Barris de Chopp</strong></td><td>185 un</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 73.075,00</td><td style="text-align:right; font-weight:700; color:var(--b2b-purple);">42.8%</td></tr>
            <tr><td><strong>Cervejas Long Neck / Latas</strong></td><td>1.240 cx</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 58.900,00</td><td style="text-align:right; font-weight:700; color:var(--b2c-blue);">34.5%</td></tr>
            <tr><td><strong>Destilados & Whiskeys</strong></td><td>320 gfs</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 26.880,00</td><td style="text-align:right;">15.7%</td></tr>
            <tr><td><strong>Não Alcoólicos (Refrig/Água)</strong></td><td>410 fds</td><td style="font-family:var(--font-mono); font-weight:700;">R$ 12.000,00</td><td style="text-align:right;">7.0%</td></tr>
          </tbody>
        </table>
      `
    },
    compras_vs_vendas: {
      id: 'compras_vs_vendas',
      title: '⚖️ Compras vs Vendas (Mês)',
      tag: 'Fluxo Físico',
      render: () => `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
          <div style="background:var(--bg-surface-subtle); padding:8px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Entradas de Compras</div>
            <div style="font-family:var(--font-mono); font-size:14px; font-weight:700; color:var(--status-danger);">R$ 59.900,00</div>
          </div>
          <div style="background:var(--bg-surface-subtle); padding:8px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Saídas Faturadas</div>
            <div style="font-family:var(--font-mono); font-size:14px; font-weight:700; color:var(--status-success);">R$ 170.855,00</div>
          </div>
        </div>
        <table class="enterprise-table" style="font-size:11px;">
          <thead>
            <tr><th>Período</th><th>Compras (R$)</th><th>Vendas (R$)</th><th>Saldo Líquido</th></tr>
          </thead>
          <tbody>
            <tr><td>Semana 01</td><td>R$ 18.500,00</td><td>R$ 42.100,00</td><td style="color:var(--status-success); font-weight:700;">+ R$ 23.600,00</td></tr>
            <tr><td>Semana 02</td><td>R$ 22.000,00</td><td>R$ 58.900,00</td><td style="color:var(--status-success); font-weight:700;">+ R$ 36.900,00</td></tr>
            <tr><td>Semana 03</td><td>R$ 19.400,00</td><td>R$ 69.855,00</td><td style="color:var(--status-success); font-weight:700;">+ R$ 50.455,00</td></tr>
          </tbody>
        </table>
      `
    },
    lucro_margens: {
      id: 'lucro_margens',
      title: '💰 Rentabilidade & Margens',
      tag: 'Controladoria',
      render: () => `
        <table class="enterprise-table" style="font-size:11px;">
          <thead>
            <tr><th>Produto</th><th>Custo</th><th>Venda</th><th>Margem R$</th><th style="text-align:right;">Markup</th></tr>
          </thead>
          <tbody>
            <tr><td>Barril 50L Pilsen</td><td>R$ 280,00</td><td>R$ 395,00</td><td style="color:var(--status-success); font-weight:700;">R$ 115,00</td><td style="text-align:right;">1.41x (29.1%)</td></tr>
            <tr><td>Cerveja Lager 600ml</td><td>R$ 89,50</td><td>R$ 128,00</td><td style="color:var(--status-success); font-weight:700;">R$ 38,50</td><td style="text-align:right;">1.43x (30.0%)</td></tr>
            <tr><td>Whisky 12 Anos 1L</td><td>R$ 110,00</td><td>R$ 168,00</td><td style="color:var(--status-success); font-weight:700;">R$ 58,00</td><td style="text-align:right;">1.52x (34.5%)</td></tr>
          </tbody>
        </table>
      `
    },
    posicao_vasilhames: {
      id: 'posicao_vasilhames',
      title: '🔄 Posição de Vasilhames (Cascos)',
      tag: 'Ativos B2B',
      render: () => `
        <table class="enterprise-table" style="font-size:11px;">
          <thead>
            <tr><th>Cliente PJ</th><th>Barril 50L</th><th>Barril 30L</th><th>Caixas 600ml</th><th style="text-align:right;">Taxa Retorno</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Boteco Vila Madalena</strong></td><td>8 un</td><td>4 un</td><td>45 cx</td><td style="text-align:right; color:var(--status-success); font-weight:700;">98.2%</td></tr>
            <tr><td><strong>Restaurante Dona Flor</strong></td><td>4 un</td><td>2 un</td><td>20 cx</td><td style="text-align:right; color:var(--status-success); font-weight:700;">95.0%</td></tr>
            <tr><td><strong>Choperia e Tap House SP</strong></td><td>12 un</td><td>6 un</td><td>10 cx</td><td style="text-align:right; color:var(--status-warning); font-weight:700;">91.4%</td></tr>
          </tbody>
        </table>
      `
    },
    dre_sintetico: {
      id: 'dre_sintetico',
      title: '📑 DRE Sintético do Mês',
      tag: 'Contábil',
      render: () => `
        <table class="enterprise-table" style="font-size:11px;">
          <tbody>
            <tr><td>(+) Receita Operacional Bruta</td><td style="text-align:right; font-family:var(--font-mono); font-weight:700;">R$ 420.500,00</td></tr>
            <tr><td>(-) Impostos & Deduções Sefaz</td><td style="text-align:right; font-family:var(--font-mono); color:var(--status-danger);">- R$ 48.357,50</td></tr>
            <tr><td><strong>(=) Receita Operacional Líquida</strong></td><td style="text-align:right; font-family:var(--font-mono); font-weight:700;">R$ 372.142,50</td></tr>
            <tr><td>(-) Custo Mercadorias Vendidas (CMV)</td><td style="text-align:right; font-family:var(--font-mono); color:var(--status-danger);">- R$ 248.900,00</td></tr>
            <tr><td><strong>(=) Lucro Bruto Operacional</strong></td><td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 123.242,50</td></tr>
            <tr><td>(-) Despesas Administrativas & Logística</td><td style="text-align:right; font-family:var(--font-mono); color:var(--status-danger);">- R$ 48.700,00</td></tr>
            <tr style="background:var(--bg-surface-subtle); font-weight:800;"><td>(=) LUCRO LÍQUIDO DO EXERCÍCIO</td><td style="text-align:right; font-family:var(--font-mono); color:var(--status-success); font-size:12px;">R$ 74.542,50 (17.7%)</td></tr>
          </tbody>
        </table>
      `
    },
    vendedores: {
      id: 'vendedores',
      title: '👥 Desempenho & Comissões',
      tag: 'Comercial',
      render: () => `
        <table class="enterprise-table" style="font-size:11px;">
          <thead>
            <tr><th>Vendedor</th><th>Pedidos</th><th>Faturado</th><th>Meta</th><th style="text-align:right;">Comissão</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Rodrigo Martins (B2B)</strong></td><td>42 ped</td><td>R$ 184.200,00</td><td><span class="status-pill pago" style="font-size:9px;">115%</span></td><td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 3.684,00</td></tr>
            <tr><td><strong>Juliana Silva (PDV)</strong></td><td>380 cup</td><td>R$ 64.800,00</td><td><span class="status-pill pago" style="font-size:9px;">102%</span></td><td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 648,00</td></tr>
            <tr><td><strong>Lucas Toledo (PDV)</strong></td><td>310 cup</td><td>R$ 52.400,00</td><td><span class="status-pill analise" style="font-size:9px;">98%</span></td><td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--status-success);">R$ 524,00</td></tr>
          </tbody>
        </table>
      `
    }
  };

  const renderReportsBoard = () => {
    const container = document.getElementById('reports-board-container');
    const badge = document.getElementById('reports-open-count-badge');
    if (!container) return;

    if (badge) badge.textContent = `${state.openedReports.length} Relatórios Abertos`;

    if (state.openedReports.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:48px 20px; background:var(--bg-surface); border:1px dashed var(--border-color); border-radius:var(--radius-xs);">
          <div style="font-size:36px; margin-bottom:8px;">📊</div>
          <h3 style="color:var(--text-main); font-size:15px; margin-bottom:4px;">Nenhum relatório aberto no painel</h3>
          <p style="font-size:12px; color:var(--text-dim); margin-bottom:14px;">Abra múltiplos relatórios lado a lado para comparar dados operacionais, fiscais e comerciais em tempo real.</p>
          <button class="btn-add-client" onclick="window.openSelectReportModal()" style="margin:0 auto;">
            ➕ Selecionar Relatório para Exibir
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    state.openedReports.forEach(repId => {
      const template = reportTemplates[repId];
      if (!template) return;

      const card = document.createElement('div');
      card.className = 'report-board-card';
      card.innerHTML = `
        <div class="report-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; font-size:13px; color:var(--text-main);">${template.title}</span>
            <span class="tag-badge tag-b2b" style="font-size:9px; padding:1px 5px;">${template.tag}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button class="btn-card-refresh" data-id="${repId}" title="Atualizar dados deste relatório" style="background:none; border:none; cursor:pointer; font-size:12px; padding:2px 4px;">🔄</button>
            <button class="btn-card-close" data-id="${repId}" title="Fechar este relatório" style="background:none; border:none; cursor:pointer; font-size:14px; color:var(--text-dim); padding:2px 4px;">✕</button>
          </div>
        </div>
        <div class="report-card-body" style="padding:10px 12px; overflow-x:auto;">
          ${template.render()}
        </div>
      `;

      card.querySelector('.btn-card-close').addEventListener('click', () => {
        removeReportFromBoard(repId);
      });

      card.querySelector('.btn-card-refresh').addEventListener('click', () => {
        showToast(`Dados de "${template.title}" atualizados com sucesso!`, 'info');
      });

      container.appendChild(card);
    });
  };

  const addReportToBoard = (repId) => {
    if (state.openedReports.includes(repId)) {
      showToast(`O relatório "${reportTemplates[repId]?.title || repId}" já está aberto no painel.`, 'info');
      return;
    }
    state.openedReports.push(repId);
    renderReportsBoard();
    showToast(`✓ Relatório "${reportTemplates[repId]?.title}" adicionado ao painel lado a lado!`, 'success');
  };

  const removeReportFromBoard = (repId) => {
    state.openedReports = state.openedReports.filter(id => id !== repId);
    renderReportsBoard();
    showToast('Relatório fechado.', 'info');
  };

  const openSelectReportModal = () => {
    const modal = document.getElementById('modal-select-report');
    if (modal) modal.classList.add('active');
  };

  window.openSelectReportModal = openSelectReportModal;
  window.addReportToBoard = addReportToBoard;
  window.removeReportFromBoard = removeReportFromBoard;

  // =========================================================================
  // 8. FINANCEIRO • ANALYTICS DE VENDAS & DADOS
  // =========================================================================
  const renderFinancialSalesAnalytics = () => {
    // Horários de Pico
    const tbodyHours = document.getElementById('fin-peakhours-tbody');
    if (tbodyHours) {
      tbodyHours.innerHTML = '';
      (state.salesAnalytics.peakHours || []).forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong style="font-family:var(--font-mono); font-size:12px;">${h.hourRange}</strong></td>
          <td style="text-align:center; font-weight:600;">${h.ordersCount} vendas</td>
          <td style="font-family:var(--font-mono); font-weight:700; color:var(--text-main);">${formatCurrency(h.revenue)}</td>
          <td style="font-family:var(--font-mono); color:var(--text-dim);">${formatCurrency(h.avgTicket)}</td>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <div style="flex:1; background:var(--border-subtle); height:6px; border-radius:3px; overflow:hidden;">
                <div style="width:${Math.min(100, h.sharePct * 3)}%; height:100%; background:var(--primary-navy);"></div>
              </div>
              <span style="font-size:10px; font-weight:700; font-family:var(--font-mono);">${h.sharePct}%</span>
            </div>
          </td>
        `;
        tbodyHours.appendChild(tr);
      });
    }

    // Dias da Semana
    const weekdaysContainer = document.getElementById('fin-weekdays-container');
    if (weekdaysContainer) {
      weekdaysContainer.innerHTML = (state.salesAnalytics.weekdays || []).map(w => {
        const fillPct = Math.min(100, Math.round(w.sharePct * 3.5));
        return `
          <div class="fin-weekday-bar-row" style="display:flex; align-items:center; gap:10px;">
            <span style="width:70px; font-weight:600; font-size:12px; color:var(--text-main);">${w.day}</span>
            <div class="fin-weekday-track" style="flex:1; background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); height:18px; border-radius:3px; overflow:hidden; position:relative;">
              <div class="fin-weekday-fill" style="width:${fillPct}%; height:100%; background:linear-gradient(90deg, var(--b2c-blue), var(--b2b-purple));"></div>
            </div>
            <span class="fin-weekday-val" style="width:110px; text-align:right; font-family:var(--font-mono); font-weight:700; font-size:12px;">${formatCurrency(w.revenue)}</span>
            <span style="width:45px; text-align:right; font-size:11px; color:var(--text-dim); font-weight:600;">${w.sharePct}%</span>
          </div>
        `;
      }).join('');
    }

    // Meios de Pagamento
    const payGrid = document.getElementById('fin-payment-methods-grid');
    if (payGrid) {
      const methods = state.salesAnalytics.paymentMethods || [
        { method: '⚡ PIX Instantâneo', val: 124500.00, pct: 32.4, status: 'Sem taxa de antecipação' },
        { method: '📄 Boleto Bancário Faturado', val: 148200.00, pct: 38.5, status: 'Prazo Médio: 21 DDL' },
        { method: '💳 TEF Cartão de Crédito', val: 68900.00, pct: 17.9, status: 'Recebimento D+30' },
        { method: '💳 TEF Cartão de Débito', val: 32420.00, pct: 8.4, status: 'Recebimento D+1' },
        { method: '💵 Dinheiro em Espécie', val: 10500.00, pct: 2.8, status: 'Caixas 01 e 02' }
      ];

      payGrid.innerHTML = methods.map(m => `
        <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-color); border-radius:var(--radius-xs); padding:12px;">
          <div style="font-weight:700; font-size:12px; color:var(--text-main);">${m.method}</div>
          <div style="font-size:18px; font-weight:800; font-family:var(--font-mono); color:var(--primary-navy); margin:6px 0 2px 0;">${formatCurrency(m.val)}</div>
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-dim);">
            <span>Participação: <strong>${m.pct}%</strong></span>
            <span>${m.status}</span>
          </div>
        </div>
      `).join('');
    }
  };

  // =========================================================================
  // 9. ADMIN • CENTRAL DE EXPORTAÇÃO INTEGRAL 100% (Excel & PDF)
  // =========================================================================
  const renderAdminExportView = () => {
    // Configura listeners dos checkboxes de exportação
  };

  window.exportarTudoExcel = () => {
    showToast('Gerando planilha Excel (.CSV UTF-8) com 100% dos dados da distribuidora...', 'info');

    let csvContent = '\uFEFF'; // UTF-8 BOM para abrir acentos perfeitamente no Excel

    // 1. ESTOQUE & PRODUTOS (Com NCM, CEST, CST, etc.)
    csvContent += '=== 1. ESTOQUE E PRODUTOS ===\n';
    csvContent += 'SKU;Produto;Categoria;Fornecedor;NCM;CEST;Regime;CST;CFOP;Custo (R$);Preco Varejo (R$);Preco Atacado B2B (R$);Embalagem;Estoque Total;Estoque Atacado;Estoque Varejo;Estoque Min;Estoque Max;Localizacao\n';
    state.products.forEach(p => {
      csvContent += `"${p.sku}";"${p.name}";"${p.category}";"${p.supplier}";"${p.ncm || '2203.00.00'}";"${p.cest || '03.001.00'}";"${p.regime || 'Simples Nacional'}";"${p.cst || '500'}";"${p.cfop || '5.405'}";"${p.cost}";"${p.price}";"${p.wholesalePrice || p.price}";"${p.wholesalePackage || 'Fardo'}";"${p.stock}";"${p.stockAtacado || p.stock}";"${p.stockVarejo || 0}";"${p.minStock}";"${p.maxStock}";"${p.location || 'Depósito'}"\n`;
    });
    csvContent += '\n';

    // 2. CLIENTES PJ
    csvContent += '=== 2. CLIENTES E EMPRESAS PJ ===\n';
    csvContent += 'ID;Razao Social;Nome Fantasia;CNPJ;Inscricao Estadual;Segmento;Limite Credito (R$);Credito Utilizado (R$);Condicao Pagamento;Total Comprado (R$);Pedidos Realizados;Vasilhames Barril 50L;Vasilhames Barril 30L;Vasilhames Caixas 600ml\n';
    state.b2bClients.forEach(c => {
      csvContent += `"${c.id}";"${c.corporateName}";"${c.tradeName}";"${c.cnpj}";"${c.ie}";"${c.segment}";"${c.creditLimit}";"${c.creditUsed}";"${c.paymentTerms}";"${c.totalPurchases || 0}";"${c.ordersCount || 0}";"${c.cascosBalance?.barril50 || 0}";"${c.cascosBalance?.barril30 || 0}";"${c.cascosBalance?.caixas600 || 0}"\n`;
    });
    csvContent += '\n';

    // 3. NOTAS FISCAIS EMITIDAS
    csvContent += '=== 3. NOTAS FISCAIS EMITIDAS (SEFAZ) ===\n';
    csvContent += 'ID;Numero NFe;Serie;Data;Modelo;Cliente;Tipo Cliente;Total (R$);Forma Pagamento;Status;Protocolo Sefaz;Chave de Acesso XML\n';
    state.fiscalInvoices.forEach(inv => {
      csvContent += `"${inv.id}";"${inv.nfeNumber}";"${inv.serie || 1}";"${inv.date}";"${inv.type}";"${inv.customer}";"${inv.customerType}";"${inv.totalAmount}";"${inv.paymentMethod}";"${inv.status}";"${inv.protocol || ''}";"${inv.xmlKey || ''}"\n`;
    });
    csvContent += '\n';

    // 4. CONTAS A PAGAR (TÍTULOS VINCULADOS ÀS NOTAS)
    csvContent += '=== 4. CONTAS A PAGAR (TITULOS VINCULADOS AS NOTAS) ===\n';
    csvContent += 'ID Titulo;NFe Vinculada;Fornecedor;Data Emissao;Data Vencimento;Categoria;Valor (R$);Linha Digitavel Boleto;Status;Chave NFe\n';
    state.payableTitles.forEach(t => {
      csvContent += `"${t.id}";"${t.nfe}";"${t.supplier}";"${t.issueDate || '15/09/2026'}";"${t.dueDate}";"${t.category}";"${t.value}";"${t.barcode}";"${t.status}";"${t.chaveNfe}"\n`;
    });
    csvContent += '\n';

    // 5. CONTAS A RECEBER B2B
    csvContent += '=== 5. CONTAS A RECEBER (FATURAMENTO B2B) ===\n';
    csvContent += 'ID;Cliente;NFe;Vencimento;Condicao;Valor (R$);Status\n';
    state.financialBillsToReceive.forEach(r => {
      csvContent += `"${r.id}";"${r.client}";"${r.nfe}";"${r.dueDate}";"${r.terms}";"${r.value}";"${r.status}"\n`;
    });
    csvContent += '\n';

    // 6. DRE GERENCIAL CONSOLIDADO
    csvContent += '=== 6. DEMONSTRATIVO DRE GERENCIAL ===\n';
    csvContent += `Receita Bruta;${state.dreSummary.receitaBruta || 420500.00}\n`;
    csvContent += `Deducoes Impostos Sefaz;${state.dreSummary.deducoesImpostos || 48357.50}\n`;
    csvContent += `Receita Liquida;${state.dreSummary.receitaLiquida || 372142.50}\n`;
    csvContent += `CMV Custo Mercadorias;${state.dreSummary.cmv || 248900.00}\n`;
    csvContent += `Lucro Bruto;${state.dreSummary.lucroBruto || 123242.50}\n`;
    csvContent += `Despesas Operacionais;${state.dreSummary.despesasOperacionais || 48700.00}\n`;
    csvContent += `Lucro Liquido;${state.dreSummary.lucroLiquido || 74542.50}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_integral_distribuidora_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('✓ Arquivo Excel (.CSV completo de TUDO) baixado com sucesso!', 'success');
  };

  window.exportarTudoPDF = () => {
    showToast('Gerando visualização para impressão em PDF de todos os relatórios consolidados...', 'info');

    const printWin = window.open('', '_blank', 'width=1000,height=800');
    if (!printWin) {
      showToast('Permita pop-ups no navegador para visualizar e salvar o PDF.', 'warning');
      return;
    }

    const prodsRows = state.products.map(p => `
      <tr>
        <td>${p.sku}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${p.ncm || '2203.00.00'}</td>
        <td style="text-align:right;">${formatCurrency(p.cost)}</td>
        <td style="text-align:right; font-weight:700;">${formatCurrency(p.wholesalePrice || p.price)}</td>
        <td style="text-align:center;">${p.stock} un</td>
        <td>${p.location || 'Depósito'}</td>
      </tr>
    `).join('');

    const clientsRows = state.b2bClients.map(c => `
      <tr>
        <td>${c.id}</td>
        <td><strong>${c.tradeName}</strong></td>
        <td>${c.cnpj}</td>
        <td>${c.segment}</td>
        <td style="text-align:right;">${formatCurrency(c.creditLimit)}</td>
        <td style="text-align:right; font-weight:700;">${formatCurrency(c.totalPurchases || 0)}</td>
        <td>${c.paymentTerms}</td>
      </tr>
    `).join('');

    const titlesRows = state.payableTitles.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.nfe}</td>
        <td><strong>${t.supplier}</strong></td>
        <td>${t.dueDate}</td>
        <td>${t.category}</td>
        <td style="text-align:right; font-weight:700;">${formatCurrency(t.value)}</td>
        <td>${t.status.toUpperCase()}</td>
      </tr>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório Executivo Integral • Distribuidora de Bebidas</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1e293b; line-height: 1.4; font-size: 12px; }
          h1 { font-size: 20px; margin: 0 0 4px 0; color: #0f172a; }
          h2 { font-size: 14px; margin: 20px 0 8px 0; border-bottom: 2px solid #cbd5e1; padding-bottom: 4px; color: #1e3a8a; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
          th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
          th { background: #f8fafc; font-weight: 700; color: #475569; }
          .header-box { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
          .kpi-card { border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 4px; background: #f8fafc; }
          .kpi-title { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          .kpi-val { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <h1>ATACAREJO & DISTRIBUIDORA DE BEBIDAS CBA LTDA</h1>
            <div>CNPJ: 18.342.981/0001-44 • Relatório Executivo 100% Consolidado</div>
          </div>
          <div style="text-align: right;">
            <div>Emissão: <strong>${new Date().toLocaleString('pt-BR')}</strong></div>
            <div>Operador: <strong>Juliana Silva (Admin)</strong></div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card"><div class="kpi-title">Receita Bruta Total</div><div class="kpi-val">${formatCurrency(state.dreSummary.receitaBruta || 420500.00)}</div></div>
          <div class="kpi-card"><div class="kpi-title">Lucro Líquido</div><div class="kpi-val" style="color:#15803d;">${formatCurrency(state.dreSummary.lucroLiquido || 74542.50)}</div></div>
          <div class="kpi-card"><div class="kpi-title">Itens em Estoque</div><div class="kpi-val">${state.products.length} Produtos</div></div>
          <div class="kpi-card"><div class="kpi-title">Clientes PJ Ativos</div><div class="kpi-val">${state.b2bClients.length} Empresas</div></div>
        </div>

        <h2>1. Catálogo Completo de Estoque, NCM e Preços</h2>
        <table>
          <thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>NCM</th><th>Custo</th><th>Venda B2B</th><th>Estoque</th><th>Local</th></tr></thead>
          <tbody>${prodsRows}</tbody>
        </table>

        <h2>2. Carteira de Clientes Corporativos PJ</h2>
        <table>
          <thead><tr><th>ID</th><th>Empresa</th><th>CNPJ</th><th>Segmento</th><th>Limite Crédito</th><th>Total Comprado</th><th>Condição</th></tr></thead>
          <tbody>${clientsRows}</tbody>
        </table>

        <h2>3. Contas a Pagar (Títulos Vinculados às Notas dos Fornecedores)</h2>
        <table>
          <thead><tr><th>Título</th><th>NF-e</th><th>Fornecedor</th><th>Vencimento</th><th>Categoria</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>${titlesRows}</tbody>
        </table>

        <div style="margin-top: 24px; text-align: center; color: #64748b; font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          Documento gerado automaticamente pelo ERP & PDV Distribuidora de Bebidas • 100% dos dados auditados
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 400);
  };




  // =========================================================================
  // BINDING DE EVENTOS GERAIS
  // =========================================================================
  const initEventListeners = () => {
    // Busca PDV
    const searchPdv = document.getElementById('pdv-search-input');
    if (searchPdv) {
      searchPdv.addEventListener('input', (e) => {
        renderPDVSearchAutocomplete(e.target.value);
      });

      searchPdv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = e.target.value.toLowerCase().trim();
          if (!q) return;
          const matched = state.products.find(p => 
            p.barcode === q || 
            p.sku.toLowerCase() === q || 
            p.name.toLowerCase().includes(q)
          );
          if (matched) {
            addToCart(matched);
            e.target.value = '';
            renderPDVSearchAutocomplete('');
          } else {
            showToast(`Nenhum produto correspondente a "${q}".`, 'warning');
          }
        }
      });
    }

    // Modal Catálogo Produtos
    const btnOpenProdModal = document.getElementById('btn-open-products-modal');
    if (btnOpenProdModal) {
      btnOpenProdModal.addEventListener('click', () => {
        document.getElementById('modal-products-catalog').classList.add('active');
        renderCatalogModalProducts();
        setTimeout(() => {
          const inp = document.getElementById('catalog-search-input');
          if (inp) inp.focus();
        }, 120);
      });
    }

    const catalogSearch = document.getElementById('catalog-search-input');
    if (catalogSearch) {
      catalogSearch.addEventListener('input', (e) => {
        state.catalogSearchQuery = e.target.value;
        renderCatalogModalProducts();
      });
    }

    const catalogSort = document.getElementById('catalog-sort-select');
    if (catalogSort) {
      catalogSort.addEventListener('change', (e) => {
        state.catalogSortBy = e.target.value;
        renderCatalogModalProducts();
      });
    }

    document.querySelectorAll('#catalog-category-tabs .category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#catalog-category-tabs .category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.catalogSelectedCategory = btn.getAttribute('data-cat');
        renderCatalogModalProducts();
      });
    });

    const btnClearCart = document.getElementById('btn-clear-cart');
    if (btnClearCart) {
      btnClearCart.addEventListener('click', () => {
        state.cart = [];
        state.orderDiscount.value = 0;
        renderPDVCart();
        showToast('Carrinho limpo.', 'info');
      });
    }

    // Modal Desconto PDV
    const btnOpenOrderDisc = document.getElementById('btn-open-order-discount');
    if (btnOpenOrderDisc) {
      btnOpenOrderDisc.addEventListener('click', () => openDiscountModal('order'));
    }

    const tabDiscItem = document.getElementById('tab-disc-item');
    const tabDiscOrder = document.getElementById('tab-disc-order');
    const togglePercent = document.getElementById('btn-disc-percent');
    const toggleCurrency = document.getElementById('btn-disc-curr');
    const inputDiscVal = document.getElementById('discount-input-val');

    if (tabDiscItem && tabDiscOrder) {
      tabDiscItem.addEventListener('click', () => {
        if (state.cart.length > 0) openDiscountModal('item', 0);
        else showToast('Nenhum item no carrinho.', 'warning');
      });
      tabDiscOrder.addEventListener('click', () => openDiscountModal('order'));

      togglePercent.addEventListener('click', () => {
        state.discountModalTarget.type = 'percentage';
        togglePercent.classList.add('active');
        toggleCurrency.classList.remove('active');
        updateDiscountPreview();
      });

      toggleCurrency.addEventListener('click', () => {
        state.discountModalTarget.type = 'value';
        toggleCurrency.classList.add('active');
        togglePercent.classList.remove('active');
        updateDiscountPreview();
      });

      inputDiscVal.addEventListener('input', updateDiscountPreview);

      document.querySelectorAll('.btn-quick-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-type');
          const val = parseFloat(btn.getAttribute('data-val'));
          state.discountModalTarget.type = type;
          inputDiscVal.value = val;

          if (type === 'percentage') {
            togglePercent.classList.add('active');
            toggleCurrency.classList.remove('active');
          } else {
            toggleCurrency.classList.add('active');
            togglePercent.classList.remove('active');
          }
          updateDiscountPreview();
        });
      });

      const btnClearCurrentDiscount = document.getElementById('btn-clear-current-discount');
      if (btnClearCurrentDiscount) {
        btnClearCurrentDiscount.addEventListener('click', () => {
          if (state.discountModalTarget.mode === 'item' && state.discountModalTarget.itemIndex !== null) {
            state.cart[state.discountModalTarget.itemIndex].discountValue = 0;
          } else {
            state.orderDiscount.value = 0;
          }
          document.getElementById('modal-discount').classList.remove('active');
          renderPDVCart();
          showToast('Desconto removido.', 'info');
        });
      }

      const btnApplyDiscount = document.getElementById('btn-apply-discount');
      if (btnApplyDiscount) {
        btnApplyDiscount.addEventListener('click', () => {
          const val = parseFloat(inputDiscVal.value) || 0;
          const type = state.discountModalTarget.type;

        if (state.discountModalTarget.mode === 'item' && state.discountModalTarget.itemIndex !== null) {
          state.cart[state.discountModalTarget.itemIndex].discountType = type;
          state.cart[state.discountModalTarget.itemIndex].discountValue = val;
          showToast(`Desconto de ${type === 'percentage' ? val + '%' : formatCurrency(val)} aplicado no item.`, 'success');
        } else {
          state.orderDiscount.type = type;
          state.orderDiscount.value = val;
          showToast(`Desconto de ${type === 'percentage' ? val + '%' : formatCurrency(val)} aplicado no pedido.`, 'success');
        }

        document.getElementById('modal-discount').classList.remove('active');
        renderPDVCart();
      });
      }
    }

    // Split Payment
    const btnFinalizePay = document.getElementById('btn-finalize-pay');
    if (btnFinalizePay) {
      btnFinalizePay.addEventListener('click', openSplitPaymentModal);
    }

    ['split-val-pix', 'split-val-tef', 'split-val-cash', 'split-val-faturado'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateSplitBalance);
    });

    const btnProcessTEF = document.getElementById('btn-process-tef');
    if (btnProcessTEF) {
      btnProcessTEF.addEventListener('click', completeSaleAndEmitNFCe);
    }

    // Filtro de Clientes PJ
    const searchClients = document.getElementById('clients-search-input');
    if (searchClients) {
      searchClients.addEventListener('input', (e) => {
        state.clientsFilterQuery = e.target.value;
        renderClientsSidebarList();
      });
    }

    // Abas da Ficha do Cliente
    document.querySelectorAll('.client-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.client-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.client-tab-content-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // Modal Novo Cliente
    const btnOpenNewClient = document.getElementById('btn-open-new-client-modal');
    if (btnOpenNewClient) {
      btnOpenNewClient.addEventListener('click', () => {
        document.getElementById('modal-new-client').classList.add('active');
      });
    }

    const btnSaveNewClient = document.getElementById('btn-save-new-client');
    if (btnSaveNewClient) {
      btnSaveNewClient.addEventListener('click', window.salvarNovoClienteCompleto);
    }

    // Importar Nota Fiscal de Fornecedor
    const initSupplierNfImport = () => { console.log("initSupplierNfImport stub"); };
    const renderSelectedSupplierNfMeta = () => { console.log("renderSelectedSupplierNfMeta stub"); };
    const importAllSupplierInvoiceItems = () => { console.log("importAllSupplierInvoiceItems stub"); };
    window.initSupplierNfImport = initSupplierNfImport;
    
    const btnOpenImportNfModal = document.getElementById('btn-open-import-nf-modal');
    if (btnOpenImportNfModal) {
      btnOpenImportNfModal.addEventListener('click', () => {
        initSupplierNfImport();
        document.getElementById('modal-import-supplier-nf')?.classList.add('active');
      });
    }

    const selectSupplierInv = document.getElementById('select-supplier-invoice');
    if (selectSupplierInv) {
      selectSupplierInv.addEventListener('change', renderSelectedSupplierNfMeta);
    }

    const btnImportAllNf = document.getElementById('btn-import-all-invoice-items');
    if (btnImportAllNf) {
      btnImportAllNf.addEventListener('click', importAllSupplierInvoiceItems);
    }

    // Relatórios Board Actions
    const btnOpenAddReport = document.getElementById('btn-open-add-report-modal');
    if (btnOpenAddReport) {
      btnOpenAddReport.addEventListener('click', openSelectReportModal);
    }

    const btnResetReports = document.getElementById('btn-reset-reports-board');
    if (btnResetReports) {
      btnResetReports.addEventListener('click', () => {
        state.openedReports = ['vendas_categoria', 'compras_vs_vendas', 'lucro_margens', 'posicao_vasilhames'];
        renderReportsBoard();
        showToast('Painel de relatórios restaurado para a configuração padrão.', 'info');
      });
    }

    const btnClearReports = document.getElementById('btn-clear-all-reports');
    if (btnClearReports) {
      btnClearReports.addEventListener('click', () => {
        state.openedReports = [];
        renderReportsBoard();
        showToast('Todos os relatórios foram fechados.', 'info');
      });
    }

    document.querySelectorAll('.report-pick-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const repId = opt.getAttribute('data-report-id');
        if (repId) {
          addReportToBoard(repId);
          document.getElementById('modal-select-report')?.classList.remove('active');
        }
      });
    });

    // Financeiro Analytics Tabs
    document.querySelectorAll('#fin-period-tabs .category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#fin-period-tabs .category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showToast(`Filtro atualizado para o período: ${btn.textContent.trim()}`, 'info');
      });
    });

    // Admin Export
    const btnExportExcel = document.getElementById('btn-export-all-excel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', window.exportarTudoExcel);
    }

    const btnExportPdf = document.getElementById('btn-export-all-pdf');
    if (btnExportPdf) {
      btnExportPdf.addEventListener('click', window.exportarTudoPDF);
    }

    const btnExportSelectAll = document.getElementById('btn-export-select-all');
    if (btnExportSelectAll) {
      btnExportSelectAll.addEventListener('click', () => {
        document.querySelectorAll('.export-chk').forEach(c => c.checked = true);
        showToast('Todos os módulos selecionados para exportação.', 'info');
      });
    }

    const btnExportDeselectAll = document.getElementById('btn-export-deselect-all');
    if (btnExportDeselectAll) {
      btnExportDeselectAll.addEventListener('click', () => {
        document.querySelectorAll('.export-chk').forEach(c => c.checked = false);
        showToast('Módulos desmarcados.', 'info');
      });
    }

    // Sangria / Suprimento Caixa
    const btnOpenSangria = document.getElementById('btn-open-sangria-modal');
    if (btnOpenSangria) {
      btnOpenSangria.addEventListener('click', () => {
        document.getElementById('movimento-caixa-title').textContent = '🛑 Registrar Sangria (Retirada de Caixa)';
        document.getElementById('movimento-caixa-tipo').value = 'sangria';
        document.getElementById('modal-movimento-caixa').classList.add('active');
      });
    }

    const btnOpenSuprimento = document.getElementById('btn-open-suprimento-modal');
    if (btnOpenSuprimento) {
      btnOpenSuprimento.addEventListener('click', () => {
        document.getElementById('movimento-caixa-title').textContent = '💵 Registrar Suprimento / Entrada de Troco';
        document.getElementById('movimento-caixa-tipo').value = 'suprimento';
        document.getElementById('modal-movimento-caixa').classList.add('active');
      });
    }

    const btnSalvarMovCaixa = document.getElementById('btn-salvar-movimento-caixa');
    if (btnSalvarMovCaixa) {
      btnSalvarMovCaixa.addEventListener('click', () => {
        const tipo = document.getElementById('movimento-caixa-tipo').value;
        const val = parseFloat(document.getElementById('movimento-caixa-valor').value) || 0;
        const motivo = document.getElementById('movimento-caixa-motivo').value.trim() || 'Movimentação operacional';

        if (val <= 0) {
          showToast('Informe um valor válido para a movimentação.', 'danger');
          return;
        }

        state.cashMovements.unshift({
          id: `MOV-0${state.cashMovements.length + 1}`,
          type: tipo,
          caixa: 'Caixa 02',
          value: val,
          reason: motivo,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          operator: 'Juliana Silva'
        });

        document.getElementById('modal-movimento-caixa').classList.remove('active');
        renderCaixaMovementsGrid();
        showToast(`${tipo === 'sangria' ? 'Sangria' : 'Suprimento'} de ${formatCurrency(val)} registrado com sucesso!`, 'success');
      });
    }

    // Fechamento de Caixa inputs
    ['fechamento-dinheiro', 'fechamento-pix', 'fechamento-cartao'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', renderCaixaFechamentoView);
    });

    // Alterações em Lote Estoque
    const catFilterLote = document.getElementById('lote-category-filter');
    if (catFilterLote) {
      catFilterLote.addEventListener('change', (e) => {
        state.loteSelectedCategory = e.target.value === 'todos' ? 'all' : e.target.value;
        renderEstoqueLoteGrid();
      });
    }

    const btnSelectAllLote = document.getElementById('btn-select-all-lote');
    if (btnSelectAllLote) {
      btnSelectAllLote.addEventListener('click', () => {
        const catFilter = state.loteSelectedCategory || 'all';
        state.selectedLoteProductIds = state.products
          .filter(p => catFilter === 'all' || p.category === catFilter)
          .map(p => p.id);
        renderEstoqueLoteGrid();
      });
    }

    const btnDeselectAllLote = document.getElementById('btn-deselect-all-lote');
    if (btnDeselectAllLote) {
      btnDeselectAllLote.addEventListener('click', () => {
        state.selectedLoteProductIds = [];
        renderEstoqueLoteGrid();
      });
    }

    const btnApplyBulk = document.getElementById('btn-apply-bulk-edit');
    if (btnApplyBulk) {
      btnApplyBulk.addEventListener('click', window.aplicarReajusteLote);
    }

    // B2B Order Bindings
    const b2bClientSelect = document.getElementById('b2b-order-client-select');
    if (b2bClientSelect) {
      b2bClientSelect.addEventListener('change', (e) => {
        state.selectedB2BClientId = e.target.value;
        renderB2BOrdersView();
      });
    }

    const btnRepeatB2B = document.getElementById('btn-repeat-last-order-b2b');
    if (btnRepeatB2B) {
      btnRepeatB2B.addEventListener('click', openRepeatOrderModalB2B);
    }

    const b2bProdSelect = document.getElementById('b2b-item-product-select');
    if (b2bProdSelect) {
      b2bProdSelect.addEventListener('input', updateB2BSelectedProductPackage);
    }

    const btnQtyMinusB2B = document.getElementById('b2b-add-qty-minus');
    const btnQtyPlusB2B = document.getElementById('b2b-add-qty-plus');
    const inputQtyB2B = document.getElementById('b2b-item-qty-input');
    if (btnQtyMinusB2B && inputQtyB2B) {
      btnQtyMinusB2B.addEventListener('click', () => {
        const val = parseInt(inputQtyB2B.value) || 1;
        inputQtyB2B.value = Math.max(1, val - 1);
      });
    }
    if (btnQtyPlusB2B && inputQtyB2B) {
      btnQtyPlusB2B.addEventListener('click', () => {
        const val = parseInt(inputQtyB2B.value) || 1;
        inputQtyB2B.value = val + 1;
      });
    }

    const btnAddProdB2B = document.getElementById('btn-add-product-b2b');
    if (btnAddProdB2B) {
      btnAddProdB2B.addEventListener('click', addProductToB2BOrder);
    }

    const btnOpenCatB2B = document.getElementById('btn-open-catalog-b2b');
    if (btnOpenCatB2B) {
      btnOpenCatB2B.addEventListener('click', () => {
        renderCatalogModalProducts();
        document.getElementById('modal-products-catalog').classList.add('active');
      });
    }

    const b2bGlobalType = document.getElementById('b2b-global-disc-type');
    const b2bGlobalVal = document.getElementById('b2b-global-disc-val');
    if (b2bGlobalType) {
      b2bGlobalType.addEventListener('change', () => {
        state.b2bOrderDiscount.type = b2bGlobalType.value;
        renderB2BItemsTable();
      });
    }
    if (b2bGlobalVal) {
      b2bGlobalVal.addEventListener('input', () => {
        state.b2bOrderDiscount.value = parseFloat(b2bGlobalVal.value) || 0;
        renderB2BItemsTable();
      });
    }

    // Vasilhames
    document.querySelectorAll('.btn-vas-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const dir = btn.getAttribute('data-dir');
        const el = document.getElementById(targetId);
        if (el) {
          let val = parseInt(el.textContent) || 0;
          if (dir === '+') val += 1;
          else val = Math.max(0, val - 1);
          el.textContent = val;
        }
      });
    });

    // Cancelamento Fiscal
    const card1 = document.getElementById('cancel-card-note-only');
    const card2 = document.getElementById('cancel-card-note-and-sale');
    if (card1 && card2) {
      card1.addEventListener('click', () => selectCancelStrategy('note-only'));
      card2.addEventListener('click', () => selectCancelStrategy('note-and-sale'));
    }

    const btnConfirmCancelFiscal = document.getElementById('btn-confirm-cancel-fiscal');
    if (btnConfirmCancelFiscal) {
      btnConfirmCancelFiscal.addEventListener('click', executeFiscalCancellation);
    }

    const searchFiscal = document.getElementById('fiscal-search-input');
    if (searchFiscal) {
      searchFiscal.addEventListener('input', (e) => {
        renderFiscalGrid('all', e.target.value);
      });
    }

    // Fechar modais universais
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Fechar dropdown do autocomplete
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('pdv-search-autocomplete');
      const searchWrapper = document.querySelector('.search-input-wrapper');
      if (dropdown && searchWrapper && !searchWrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    const bindBtn = (id, msg) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => window.showToast(msg, 'success'));
    };
    bindBtn('btn-create-b2b-order-for-client', 'Iniciando novo pedido B2B...');
    // removed open report bind
    bindBtn('btn-reset-reports-board', 'Painel de relatórios resetado.');

    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.btn-close-modal') || (e.target.classList && e.target.classList.contains('btn-close-modal') ? e.target : null);
      if (closeBtn) {
        const modal = closeBtn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      }
      if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
      }
      if (e.target.textContent && e.target.textContent.includes('Abrir Caixa')) {
         window.showToast('Caixa aberto com sucesso!', 'success');
      }
    });

    // Atalhos Globais de Teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        const inp = document.getElementById('pdv-search-input');
        if (inp) {
          inp.focus();
          inp.select();
        }
      } else if (e.key === 'F10') {
        e.preventDefault();
        openSplitPaymentModal();
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        const dropdown = document.getElementById('pdv-search-autocomplete');
        if (dropdown) dropdown.classList.remove('active');
      }
    });
  };

  // Inicialização do Sistema
  initAccordionNavigation();
  initMobileSidebar();
  initEventListeners();
  renderDashboardGeralView();
  initSupplierNfImport();
});

window.abrirNovoOrcamento = () => {
  window.showToast('Assistente de Novo Or�amento aberto com sucesso.', 'success');
  // clear form
  document.getElementById('b2b-order-client-select').selectedIndex = 0;
  state.b2bOrderCart = [];
  renderB2BItemsTable();
};
