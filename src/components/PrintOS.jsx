import React from 'react';

/**
 * Modern, professional print layout for Ordem de Serviço.
 * Rendered hidden on screen; becomes visible only in @media print via .print-only.
 */
const PrintOS = ({ order, settings, getClientData }) => {
  if (!order) return null;

  const phone = order.clientUuid
    ? (getClientData(order.clientUuid).phone || order.clientPhone || 'Não informado')
    : (order.clientPhone || 'Não informado');

  const email = order.clientUuid
    ? (getClientData(order.clientUuid).email || order.clientEmail || 'Não informado')
    : (order.clientEmail || 'Não informado');

  const dateLabel = order.serviceDate
    ? new Date(order.serviceDate + 'T12:00:00').toLocaleDateString('pt-BR')
    : new Date(order.date).toLocaleDateString('pt-BR');

  const fmt = (v) => (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const isPaid = order.paymentStatus === 'Pago';
  const accentColor = '#4f46e5';
  const accentLight = '#ede9fe';

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
        {/* Brand */}
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
          <p style={{ margin: '2px 0', fontSize: 12, color: '#555' }}>
            📞 {settings.pixKey}
          </p>
        </div>

        {/* OS Badge */}
        <div style={{
          textAlign: 'right',
          background: accentLight,
          border: `2px solid ${accentColor}`,
          borderRadius: 12,
          padding: '12px 22px',
          minWidth: 180,
        }}>
          <p style={{ margin: 0, fontSize: 10, color: accentColor, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
            Ordem de Serviço
          </p>
          <p style={{ margin: '4px 0', fontSize: 28, fontWeight: 900, color: accentColor }}>
            #{order.id}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            <strong>Data:</strong> {dateLabel}
          </p>
          <p style={{ margin: '2px 0', fontSize: 11, color: '#555' }}>
            <strong>Status:</strong>{' '}
            <span style={{ color: order.status === 'Concluído' ? '#059669' : order.status === 'Em Andamento' ? '#2563eb' : '#d97706', fontWeight: 700 }}>
              {order.status}
            </span>
          </p>
        </div>
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
              ['Nome', order.clientName],
              ['Telefone', phone],
              ['E-mail', email],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#666', minWidth: 60 }}>{label}:</span>
                <span style={{ fontWeight: 600, color: '#111' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipamento */}
        <div style={{ border: `1.5px solid #e5e7eb`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: accentColor, padding: '7px 14px' }}>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              🔧 Informações Técnicas
            </p>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {[
              ['Equipamento', order.device],
              ['Categoria', order.category],
              ['Pagamento', order.paymentMethod],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#666', minWidth: 76 }}>{label}:</span>
                <span style={{ fontWeight: 600, color: '#111' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICE DESCRIPTION ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ background: '#f8fafc', border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: accentColor, padding: '7px 14px' }}>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              📋 Descrição do Serviço / Relatório Técnico
            </p>
          </div>
          <div style={{ padding: '14px', minHeight: 110, fontSize: 13, color: '#222', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {order.service || 'Sem descrição informada.'}
          </div>
        </div>
      </div>

      {/* ── TOTALS + PAYMENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start', marginBottom: 24 }}>

        {/* Pix */}
        <div style={{
          border: '1.5px solid #bbf7d0',
          background: '#f0fdf4',
          borderRadius: 10,
          padding: '14px 18px',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            💚 Pagamento via Pix
          </p>
          <p style={{ margin: '3px 0', fontSize: 14, fontWeight: 700, color: '#111' }}>{settings.pixKey}</p>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            Tipo: {settings.pixType} &nbsp;|&nbsp; Titular: {settings.businessName}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 10, color: '#888' }}>
            * Também aceito: Cartão, Dinheiro e Transferência.
          </p>
        </div>

        {/* Value table */}
        <div style={{ minWidth: 230 }}>
          {[
            ['Mão de Obra', fmt(order.laborPrice), false],
            ['Peças / Materiais', fmt(order.partsPrice), false],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #f0f0f0', fontSize: 12 }}>
              <span style={{ color: '#666' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>R$ {val}</span>
            </div>
          ))}

          {/* Total row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 10px',
            background: accentColor,
            borderRadius: '0 0 8px 8px',
            marginTop: 4,
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>TOTAL</span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>R$ {fmt(order.price)}</span>
          </div>

          {/* Payment status pill */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 16px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              background: isPaid ? '#dcfce7' : '#fef3c7',
              color: isPaid ? '#065f46' : '#92400e',
              border: `1px solid ${isPaid ? '#86efac' : '#fcd34d'}`,
            }}>
              {isPaid ? '✓ PAGO' : '⏳ ' + (order.paymentStatus || 'Pendente').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ── SIGNATURE + FOOTER ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #bbb', paddingTop: 8 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#444', fontWeight: 600 }}>Assinatura do Responsável Técnico</p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: '#888' }}>{settings.businessName}</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #bbb', paddingTop: 8 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#444', fontWeight: 600 }}>Assinatura / Aprovação do Cliente</p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: '#888' }}>Confirmo o serviço descrito acima</p>
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
          OS #{order.id} &nbsp;·&nbsp; {dateLabel}
        </p>
      </div>
    </div>
  );
};

export default PrintOS;
