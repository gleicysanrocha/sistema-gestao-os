import React from 'react';

/**
 * Modern, professional print layout for Orçamento / Proposta Comercial.
 */
const PrintBudget = ({ budget, settings }) => {
  if (!budget) return null;

  const fmt = (v) => (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  // Use editable proposal date or fall back to stored date
  const proposalDateRaw = budget.proposalDate || budget.date?.split('T')[0];
  const dateLabel = proposalDateRaw
    ? new Date(proposalDateRaw + 'T12:00:00').toLocaleDateString('pt-BR')
    : new Date(budget.date).toLocaleDateString('pt-BR');

  const validDays = parseInt(budget.validityDays);
  const semValidade = validDays === 0;
  const baseDate = proposalDateRaw ? new Date(proposalDateRaw + 'T12:00:00') : new Date(budget.date);
  const validDate = !semValidade
    ? new Date(baseDate.getTime() + validDays * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
    : null;

  const paymentOption = budget.paymentOption || 'Pix à Vista';
  const isParcelado = paymentOption.toLowerCase().includes('parcelado');
  const proposalTitle = budget.proposalName || 'Proposta Comercial';

  const accentColor = '#4f46e5';
  const accentLight = '#ede9fe';

  const categoryLabel = {
    celular: '📱 Manutenção de Celular',
    notebook: '💻 Manutenção de Notebook',
    computador: '🖥️ Montagem de Computador',
    sistema: '🖥️ Projeto de Sistema',
    site: '🌐 Criação de Site',
    automacao: '🤖 Automação',
  }[budget.category] || budget.category || 'Serviço';

  return (
    <div className="print-only" style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: '#fff',
      color: '#111',
      padding: '12mm 14mm',
      boxSizing: 'border-box',
      minHeight: '100vh',
      lineHeight: 1.5,
    }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: accentColor,
            borderRadius: 10,
            padding: '6px 16px',
            marginBottom: 10,
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: 0.5 }}>
              {settings.businessName}
            </span>
          </div>
          <p style={{ margin: '2px 0', fontSize: 12, color: '#555' }}>{settings.businessDescription}</p>
          <p style={{ margin: '2px 0', fontSize: 12, color: '#555' }}>📞 {settings.pixKey}</p>
        </div>

        <div style={{
          textAlign: 'right',
          background: accentLight,
          border: `2px solid ${accentColor}`,
          borderRadius: 12,
          padding: '12px 22px',
          minWidth: 200,
        }}>
          <p style={{ margin: 0, fontSize: 10, color: accentColor, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
            {proposalTitle}
          </p>
          <p style={{ margin: '4px 0', fontSize: 28, fontWeight: 900, color: accentColor }}>
            #{budget.id}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}><strong>Emitida em:</strong> {dateLabel}</p>
          <p style={{ margin: '2px 0', fontSize: 11, color: semValidade ? '#059669' : '#d97706', fontWeight: 700 }}>
            {semValidade ? '✅ Sem prazo de validade' : `Válida até: ${validDate}`}
          </p>
        </div>
      </div>

      {/* ── Greeting ── */}
      <div style={{
        background: '#f8fafc',
        border: `1.5px solid #e5e7eb`,
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: 8,
        padding: '12px 18px',
        marginBottom: 20,
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#333' }}>
          Prezado(a) <strong>{budget.clientName}</strong>,
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555' }}>
          É com prazer que apresentamos nossa proposta técnica e comercial referente à categoria:{' '}
          <strong style={{ color: accentColor }}>{categoryLabel}</strong>.
          Ficamos à disposição para quaisquer esclarecimentos.
        </p>
      </div>

      {/* ── INFO GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {/* Cliente */}
        <div style={{ border: `1.5px solid #e5e7eb`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: accentColor, padding: '7px 14px' }}>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              👤 Dados do Cliente
            </p>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {[
              ['Nome', budget.clientName],
              ['Telefone', budget.clientPhone || 'Não informado'],
              ['E-mail', budget.clientEmail || 'Não informado'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#666', minWidth: 60 }}>{label}:</span>
                <span style={{ fontWeight: 600, color: '#111' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projeto */}
        <div style={{ border: `1.5px solid #e5e7eb`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: accentColor, padding: '7px 14px' }}>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              📁 Projeto / Equipamento
            </p>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {[
              ['Referência', budget.device],
              ['Categoria', categoryLabel],
              ['Proposta Nº', `#${budget.id}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#666', minWidth: 76 }}>{label}:</span>
                <span style={{ fontWeight: 600, color: '#111' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESCRIPTION ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: accentColor, padding: '7px 14px' }}>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              📋 Descrição Técnica da Proposta
            </p>
          </div>
          <div style={{ padding: '14px', minHeight: 130, fontSize: 13, color: '#222', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {budget.description || 'Sem descrição informada.'}
          </div>
        </div>
      </div>

      {/* ── PAYMENT + TOTAL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start', marginBottom: 24 }}>
        {/* Pix */}
        <div style={{ border: '1.5px solid #bbf7d0', background: '#f0fdf4', borderRadius: 10, padding: '14px 18px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            💚 Condições de Pagamento
          </p>
          <p style={{ margin: '3px 0', fontSize: 14, fontWeight: 700, color: '#111' }}>
            Pix: {settings.pixKey}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            Tipo: {settings.pixType} &nbsp;|&nbsp; Titular: {settings.businessName}
          </p>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #bbf7d0' }}>
            <p style={{ margin: '3px 0', fontSize: 12, color: '#065f46', fontWeight: 700 }}>
              💳 {paymentOption}
            </p>
            {isParcelado && (
              <p style={{ margin: '2px 0', fontSize: 11, color: '#555' }}>
                ✔ Parcelamento via transferência Pix — cada parcela enviada separadamente
              </p>
            )}
            <p style={{ margin: '2px 0', fontSize: 11, color: '#888' }}>
              {semValidade
                ? '* Esta proposta não possui prazo de validade definido.'
                : `* Proposta válida por ${validDays} dias corridos a partir da emissão.`}
            </p>
          </div>
        </div>

        {/* Total */}
        <div style={{ minWidth: 220, textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#555' }}>Valor Total do Investimento:</p>
          <div style={{
            background: accentColor,
            borderRadius: 10,
            padding: '16px 20px',
            display: 'inline-block',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: 1 }}>Total</p>
            <p style={{ margin: '4px 0 0', fontSize: 30, fontWeight: 900, color: '#fff' }}>
              R$ {fmt(budget.price)}
            </p>
          </div>
        </div>
      </div>

      {/* ── SIGNATURES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #bbb', paddingTop: 8 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#444', fontWeight: 600 }}>Prestador de Serviços</p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: '#888' }}>{settings.businessName}</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #bbb', paddingTop: 8 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#444', fontWeight: 600 }}>Aceite / Aprovação do Cliente</p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: '#888' }}>Confirmo o recebimento desta proposta</p>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div style={{
        marginTop: 24,
        background: accentColor,
        borderRadius: 8,
        padding: '7px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ margin: 0, color: '#c7d2fe', fontSize: 10 }}>
          Documento gerado por <strong style={{ color: '#fff' }}>{settings.systemName}</strong>
        </p>
        <p style={{ margin: 0, color: '#c7d2fe', fontSize: 10 }}>
          Proposta #{budget.id} &nbsp;·&nbsp; {dateLabel}
        </p>
      </div>
    </div>
  );
};

export default PrintBudget;
