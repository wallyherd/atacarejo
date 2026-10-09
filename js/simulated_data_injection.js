document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // 1. Caixa Abertura
    const cAbert = document.getElementById('caixas-terminals-grid');
    if (cAbert) {
      cAbert.innerHTML = `
        <div class="b2b-panel-card" style="text-align:center;">
          <h3 style="margin-bottom:8px;">Caixa 01 (Balcão)</h3>
          <span class="status-pill ativo">Aberto</span>
          <div style="margin-top:15px;">
            <button class="btn-secondary" onclick="showToast('Caixa já operando.', 'info')">Verificar</button>
          </div>
        </div>
        <div class="b2b-panel-card" style="text-align:center;">
          <h3 style="margin-bottom:8px;">Caixa 02 (Reserva)</h3>
          <span style="color:var(--text-dim);">Fechado</span>
          <div style="margin-top:15px;">
            <button class="btn-add-client" onclick="showToast('Caixa 02 aberto com sucesso!', 'success')">Abrir Caixa</button>
          </div>
        </div>
      `;
    }

    // 2. Caixa - Todos os Caixas (Assuming there is a table/grid)
    const viewTodos = document.getElementById('view-caixa-todos');
    if (viewTodos) {
      const container = viewTodos.querySelector('.module-view-layout');
      if (container && !viewTodos.querySelector('.simulated-content')) {
        const div = document.createElement('div');
        div.className = 'simulated-content';
        div.innerHTML = `
          <div class="b2b-panel-card">
            <table class="data-table">
              <thead><tr><th>ID</th><th>Caixa</th><th>Operador</th><th>Status</th><th>Saldo</th></tr></thead>
              <tbody>
                <tr><td>#CX-001</td><td>Caixa 01 (Balcão)</td><td>João Silva</td><td><span class="status-pill ativo">Aberto</span></td><td>R$ 450,00</td></tr>
                <tr><td>#CX-002</td><td>Caixa 02 (Reserva)</td><td>-</td><td><span style="color:var(--text-dim);">Fechado</span></td><td>R$ 0,00</td></tr>
              </tbody>
            </table>
          </div>
        `;
        container.appendChild(div);
      }
    }

    // 3. Estoque - Histórico
    const viewEstH = document.getElementById('view-estoque-historico');
    if (viewEstH) {
      const container = viewEstH.querySelector('.module-view-layout');
      if (container && !viewEstH.querySelector('.simulated-content')) {
        const div = document.createElement('div');
        div.className = 'simulated-content';
        div.innerHTML = `
          <div class="b2b-panel-card">
            <table class="data-table">
              <thead><tr><th>Data/Hora</th><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Usuário</th></tr></thead>
              <tbody>
                <tr><td>23/09/2026 14:30</td><td>Cerveja Skol Litro</td><td><span style="color:var(--status-danger);">Saída (Venda)</span></td><td>-2 cx</td><td>João Silva</td></tr>
                <tr><td>23/09/2026 10:15</td><td>Refrigerante Coca-Cola 2L</td><td><span style="color:var(--status-success);">Entrada (Compra)</span></td><td>+50 un</td><td>Admin</td></tr>
              </tbody>
            </table>
          </div>
        `;
        container.appendChild(div);
      }
    }

    // 4. Compras - Teto de Compra
    const viewTeto = document.getElementById('view-compras-budget');
    if (viewTeto) {
      const container = viewTeto.querySelector('.module-view-layout');
      if (container && !viewTeto.querySelector('.simulated-content')) {
        const div = document.createElement('div');
        div.className = 'simulated-content';
        div.innerHTML = `
          <div class="b2b-panel-card" style="max-width:600px; margin:0 auto;">
            <h3 style="margin-bottom:15px;">Budget Mensal de Compras</h3>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span>Utilizado: R$ 85.000,00</span>
              <span>Teto: R$ 120.000,00</span>
            </div>
            <div style="background:var(--border-subtle); height:12px; border-radius:6px; overflow:hidden;">
              <div style="width: 70%; height:100%; background:var(--status-warning);"></div>
            </div>
            <p style="margin-top:15px; font-size:12px; color:var(--text-dim);">Ainda restam R$ 35.000,00 para compras neste mês.</p>
          </div>
        `;
        container.appendChild(div);
      }
    }

    // 5. Compras - Análise de preços (Sugestão com comparativo)
    const viewAnalise = document.getElementById('view-compras-analise');
    if (viewAnalise) {
      const container = viewAnalise.querySelector('.module-view-layout');
      if (container && !viewAnalise.querySelector('.simulated-content')) {
        const div = document.createElement('div');
        div.className = 'simulated-content';
        div.innerHTML = `
          <div class="b2b-panel-card">
            <h3 style="margin-bottom:15px;">Sugestão de Compras & Comparativo de Fornecedores</h3>
            <p style="font-size:12px; color:var(--text-dim); margin-bottom:15px;">Produtos baseados em alto giro, margem e baixo estoque.</p>
            <table class="data-table">
              <thead><tr><th>Produto</th><th>Motivo</th><th>Fornecedor A (Ambev)</th><th>Fornecedor B (Atacadão)</th><th>Ação</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>Skol Pilsen Lata 350ml</strong></td>
                  <td>Estoque Crítico (2 un)</td>
                  <td style="color:var(--status-success); font-weight:bold;">R$ 2,80 / un</td>
                  <td>R$ 2,95 / un</td>
                  <td><button class="btn-primary" style="padding:4px 8px; font-size:11px;">Comprar A</button></td>
                </tr>
                <tr>
                  <td><strong>Coca-Cola 2L</strong></td>
                  <td>Alto Giro (Vende 50/dia)</td>
                  <td>R$ 8,10 / un</td>
                  <td style="color:var(--status-success); font-weight:bold;">R$ 7,90 / un</td>
                  <td><button class="btn-primary" style="padding:4px 8px; font-size:11px;">Comprar B</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
        container.appendChild(div);
      }
    }

    // 6. Relatórios - DRE
    const dre = document.getElementById('rel-dre-table');
    if (dre) {
      dre.innerHTML = `
        <tbody>
        <tr><td>1. Receita Bruta de Vendas</td><td style="text-align:right;">R$ 150.000,00</td></tr>
        <tr><td>2. Deduções (Impostos/Devoluções)</td><td style="text-align:right; color:var(--status-danger);">-R$ 18.000,00</td></tr>
        <tr style="font-weight:700; background:var(--bg-surface-subtle);"><td>3. Receita Líquida (1 - 2)</td><td style="text-align:right;">R$ 132.000,00</td></tr>
        <tr><td>4. Custo da Mercadoria Vendida (CMV)</td><td style="text-align:right; color:var(--status-danger);">-R$ 80.000,00</td></tr>
        <tr style="font-weight:700; background:var(--bg-surface-subtle);"><td>5. Lucro Bruto (3 - 4)</td><td style="text-align:right;">R$ 52.000,00</td></tr>
        <tr><td>6. Despesas Operacionais</td><td style="text-align:right; color:var(--status-danger);">-R$ 20.000,00</td></tr>
        <tr style="font-weight:700; background:var(--status-success-bg); color:var(--status-success); font-size:14px;"><td>7. Lucro Líquido (5 - 6)</td><td style="text-align:right;">R$ 32.000,00</td></tr>
        </tbody>
      `;
    }

    // 7. Admin - Permissões
    const viewPerm = document.getElementById('view-admin-permissoes');
    if (viewPerm) {
      const container = viewPerm.querySelector('.module-view-layout');
      if (container && !viewPerm.querySelector('.simulated-content')) {
        const div = document.createElement('div');
        div.className = 'simulated-content';
        div.innerHTML = `
          <div class="b2b-panel-card">
            <h3 style="margin-bottom:15px;">Grupos de Permissões</h3>
            <table class="data-table">
              <thead><tr><th>Grupo</th><th>Usuários Vinculados</th><th>Acesso PDV</th><th>Acesso Financeiro</th><th>Ações</th></tr></thead>
              <tbody>
                <tr><td>Administrador</td><td>2</td><td>Sim</td><td>Sim</td><td><button class="btn-secondary">Editar</button></td></tr>
                <tr><td>Caixa / Operador</td><td>5</td><td>Sim</td><td>Não</td><td><button class="btn-secondary">Editar</button></td></tr>
                <tr><td>Gerente de Estoque</td><td>1</td><td>Não</td><td>Não</td><td><button class="btn-secondary">Editar</button></td></tr>
              </tbody>
            </table>
            <button class="btn-primary" style="margin-top:15px;">+ Novo Grupo</button>
          </div>
        `;
        container.appendChild(div);
      }
    }
    // 8. Financeiro - Analytics de Vendas
    const peakTbody = document.getElementById('fin-peakhours-tbody');
    if (peakTbody) {
      peakTbody.innerHTML = `
        <tr><td>08:00 - 10:00</td><td>45</td><td>R$ 1.250,00</td><td>R$ 27,77</td><td>12%</td></tr>
        <tr style="background:var(--bg-surface-subtle); font-weight:bold;"><td>14:00 - 17:00</td><td>120</td><td>R$ 8.400,00</td><td>R$ 70,00</td><td>48%</td></tr>
        <tr><td>17:00 - 20:00</td><td>80</td><td>R$ 4.500,00</td><td>R$ 56,25</td><td>30%</td></tr>
      `;
    }

    const weekdaysCont = document.getElementById('fin-weekdays-container');
    if (weekdaysCont) {
      weekdaysCont.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="width:80px; font-size:12px;">Sexta</span>
          <div style="flex:1; margin:0 10px; background:var(--border-subtle); height:14px; border-radius:4px;"><div style="width:100%; height:100%; background:var(--b2b-purple); border-radius:4px;"></div></div>
          <span style="font-family:var(--font-mono); font-size:11px; font-weight:bold; width:80px; text-align:right;">R$ 45k (35%)</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="width:80px; font-size:12px;">Sábado</span>
          <div style="flex:1; margin:0 10px; background:var(--border-subtle); height:14px; border-radius:4px;"><div style="width:80%; height:100%; background:var(--b2b-purple); border-radius:4px;"></div></div>
          <span style="font-family:var(--font-mono); font-size:11px; font-weight:bold; width:80px; text-align:right;">R$ 36k (28%)</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="width:80px; font-size:12px;">Quinta</span>
          <div style="flex:1; margin:0 10px; background:var(--border-subtle); height:14px; border-radius:4px;"><div style="width:40%; height:100%; background:var(--b2b-purple); border-radius:4px;"></div></div>
          <span style="font-family:var(--font-mono); font-size:11px; font-weight:bold; width:80px; text-align:right;">R$ 15k (11%)</span>
        </div>
      `;
    }

    const payCont = document.getElementById('fin-payment-methods-grid');
    if (payCont && !payCont.innerHTML.trim()) {
      payCont.innerHTML = `
        <div style="background:var(--bg-surface); padding:10px; border:1px solid var(--border-subtle); border-radius:6px; text-align:center;">
          <h4 style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">PIX (Instantâneo)</h4>
          <strong style="font-size:15px;">45.5%</strong>
        </div>
        <div style="background:var(--bg-surface); padding:10px; border:1px solid var(--border-subtle); border-radius:6px; text-align:center;">
          <h4 style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">Cartão de Crédito</h4>
          <strong style="font-size:15px;">32.0%</strong>
        </div>
        <div style="background:var(--bg-surface); padding:10px; border:1px solid var(--border-subtle); border-radius:6px; text-align:center;">
          <h4 style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">Boleto B2B</h4>
          <strong style="font-size:15px;">15.0%</strong>
        </div>
        <div style="background:var(--bg-surface); padding:10px; border:1px solid var(--border-subtle); border-radius:6px; text-align:center;">
          <h4 style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">Dinheiro (PDV)</h4>
          <strong style="font-size:15px;">7.5%</strong>
        </div>
      `;
    }

    // 9. Financeiro - Contas a Pagar
    const pagarTbody = document.getElementById('financeiro-pagar-tbody');
    if (pagarTbody) {
      pagarTbody.innerHTML = `
        <tr>
          <td><strong style="font-family:var(--font-mono);">B-9021-A</strong></td>
          <td><a href="#" style="color:var(--primary-navy); font-size:11px;" onclick="window.showToast('Abrindo Danfe...', 'info')">NFe 009283</a></td>
          <td>Ambev S.A.</td>
          <td style="color:var(--text-dim); font-size:11px;">10/09/2026</td>
          <td><strong style="color:var(--status-danger);">25/09/2026</strong></td>
          <td><span class="tag-badge">Mercadoria</span></td>
          <td style="font-family:var(--font-mono); font-weight:700;">R$ 14.250,00</td>
          <td style="font-family:var(--font-mono); font-size:10px; color:var(--text-dim);">34191.09008 00000.00000 00000.00000 1 000000000</td>
          <td><span class="status-pill analise">A Vencer</span></td>
          <td style="text-align:right;">
            <button class="btn-primary" style="padding:4px 8px; font-size:10px;" onclick="window.showToast('Lançando pagamento...', 'success')">Pagar</button>
          </td>
        </tr>
        <tr>
          <td><strong style="font-family:var(--font-mono);">FAT-110</strong></td>
          <td><span style="color:var(--text-dim); font-size:11px;">Sem NF vinculada</span></td>
          <td>Enel Distribuição</td>
          <td style="color:var(--text-dim); font-size:11px;">05/09/2026</td>
          <td>28/09/2026</td>
          <td><span class="tag-badge tag-b2c">Custo Fixo</span></td>
          <td style="font-family:var(--font-mono); font-weight:700;">R$ 1.850,20</td>
          <td style="font-family:var(--font-mono); font-size:10px; color:var(--text-dim);">Débito Automático Conta PJ</td>
          <td><span class="status-pill analise">A Vencer</span></td>
          <td style="text-align:right;">
            <button class="btn-primary" style="padding:4px 8px; font-size:10px;" onclick="window.showToast('Lançando pagamento...', 'success')">Pagar</button>
          </td>
        </tr>
      `;
    }
  }, 800); // Executar um pouco depois da renderização inicial do app.js
});
