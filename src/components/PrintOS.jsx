import React from 'react';

/**
 * Modern, highly professional print layout for Ordem de Serviço (Service Order).
 * Rendered hidden on screen; becomes visible only in @media print via .print-only.
 * Optimized to fit neatly on a single A4 page for standard service orders.
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

  
  // Theme Color System
  // Theme Color System
  const brandPrimary = '#0f172a'; // Slate 900
  const brandAccent = '#4f46e5';  // Indigo 600
  const brandBorder = '#e2e8f0';  // Slate 200
  const brandBgLight = '#f8fafc'; // Slate 50
  
  return (
    <div className="print-only" style={{
      fontFamily: "'Outfit', 'Inter', 'Segoe UI', Arial, sans-serif",
      background: '#fff',
      color: '#1e293b',
      padding: '10mm 12mm',
      boxSizing: 'border-box',
      minHeight: '100vh',
      lineHeight: 1.4,
      fontSize: '12px'
    }}>

      {/* ── HEADER SECTION ── */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: `2px solid ${brandAccent}`,
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        {/* Left Side: Business Info */}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: 800, 
            color: brandPrimary,
            letterSpacing: '-0.5px'
          }}>
            {settings.businessName}
          </h1>
          <p style={{ margin: '4px 0 2px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
            {settings.businessDescription}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#475569' }}>
            <span>📞 {settings.pixKey}</span>
          </div>
        </div>

        {/* Right Side: OS Document Badge */}
        <div style={{
          textAlign: 'right',
          background: brandBgLight,
          border: `1px solid ${brandBorder}`,
          borderRadius: '12px',
          padding: '12px 20px',
          minWidth: '200px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '9px', 
            color: brandAccent, 
            textTransform: 'uppercase', 
            fontWeight: 700, 
            letterSpacing: '1px' 
          }}>
            Ordem de Serviço
          </p>
          <p style={{ margin: '2px 0 6px', fontSize: '26px', fontWeight: 900, color: brandPrimary }}>
            #{order.id}
          </p>
          <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span><strong>Data:</strong> {dateLabel}</span>
          </div>
        </div>
      </div>

      {/* ── CLIENT & TECHNICAL DATA GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Client Box */}
        <div style={{ 
          border: `1px solid ${brandBorder}`, 
          borderRadius: '10px', 
          background: brandBgLight,
          overflow: 'hidden' 
        }}>
          <div style={{ background: brandPrimary, padding: '8px 14px' }}>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Dados do Cliente
            </h3>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '11px' }}>
              <span style={{ color: '#64748b', width: '70px', fontWeight: 500 }}>Nome:</span>
              <span style={{ fontWeight: 600, color: brandPrimary }}>{order.clientName}</span>
            </div>
            <div style={{ display: 'flex', fontSize: '11px' }}>
              <span style={{ color: '#64748b', width: '70px', fontWeight: 500 }}>Telefone:</span>
              <span style={{ fontWeight: 600, color: brandPrimary }}>{phone}</span>
            </div>
            <div style={{ display: 'flex', fontSize: '11px' }}>
              <span style={{ color: '#64748b', width: '70px', fontWeight: 500 }}>E-mail:</span>
              <span style={{ fontWeight: 600, color: brandPrimary }}>{email}</span>
            </div>
          </div>
        </div>

        {/* Technical Data Box */}
        <div style={{ 
          border: `1px solid ${brandBorder}`, 
          borderRadius: '10px', 
          background: brandBgLight,
          overflow: 'hidden' 
        }}>
          <div style={{ background: brandPrimary, padding: '8px 14px' }}>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              Informações Técnicas
            </h3>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '11px' }}>
              <span style={{ color: '#64748b', width: '90px', fontWeight: 500 }}>Dispositivo:</span>
              <span style={{ fontWeight: 600, color: brandPrimary }}>{order.device}</span>
            </div>
            <div style={{ display: 'flex', fontSize: '11px' }}>
              <span style={{ color: '#64748b', width: '90px', fontWeight: 500 }}>Categoria:</span>
              <span style={{ fontWeight: 600, color: brandPrimary }}>{order.category}</span>
            </div>
            <div style={{ display: 'flex', fontSize: '11px' }}>
              <span style={{ color: '#64748b', width: '90px', fontWeight: 500 }}>F. Pagamento:</span>
              <span style={{ fontWeight: 600, color: brandPrimary }}>{order.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TECHNICAL SERVICE REPORT ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ border: `1px solid ${brandBorder}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: brandPrimary, padding: '8px 14px' }}>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Relatório do Serviço Executado
            </h3>
          </div>
          <div style={{ 
            padding: '14px', 
            minHeight: '120px', 
            fontSize: '12px', 
            color: '#334155', 
            whiteSpace: 'pre-wrap', 
            lineHeight: 1.6,
            background: '#fafafa'
          }}>
            {order.service || 'Nenhum detalhe técnico informado.'}
          </div>
        </div>
      </div>

      {/* ── VALUES DETAILED TABLE ── */}
      <div style={{ marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: brandPrimary }}>
              <th style={{ padding: '8px 12px', color: '#fff', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', textAlign: 'left', borderTopLeftRadius: '6px' }}>Descrição dos Itens / Serviços</th>
              <th style={{ padding: '8px 12px', color: '#fff', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', textAlign: 'center' }}>Tipo</th>
              <th style={{ padding: '8px 12px', color: '#fff', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', textAlign: 'right', borderTopRightRadius: '6px' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 12px', borderBottom: `1px solid ${brandBorder}`, fontWeight: 500 }}>Serviço de Mão de Obra Técnica</td>
              <td style={{ padding: '10px 12px', borderBottom: `1px solid ${brandBorder}`, textAlign: 'center', color: '#64748b' }}>Mão de Obra</td>
              <td style={{ padding: '10px 12px', borderBottom: `1px solid ${brandBorder}`, textAlign: 'right', fontWeight: 600 }}>R$ {fmt(order.laborPrice)}</td>
            </tr>
            {order.partsPrice > 0 && (
              <tr>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${brandBorder}`, fontWeight: 500 }}>Peças, Componentes e Materiais Utilizados</td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${brandBorder}`, textAlign: 'center', color: '#64748b' }}>Hardware/Peça</td>
                <td style={{ padding: '10px 12px', borderBottom: `1px solid ${brandBorder}`, textAlign: 'right', fontWeight: 600 }}>R$ {fmt(order.partsPrice)}</td>
              </tr>
            )}
            {/* Total Row */}
            <tr style={{ background: brandBgLight }}>
              <td colSpan="2" style={{ padding: '12px', fontWeight: 700, fontSize: '12px', color: brandPrimary, textTransform: 'uppercase', borderBottomLeftRadius: '6px' }}>Valor Total da Ordem de Serviço</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, fontSize: '16px', color: brandAccent, borderBottomRightRadius: '6px' }}>R$ {fmt(order.price)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PAYMENT DETAILS ── */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ 
          border: '1px solid #c4b5fd', 
          background: '#f5f3ff', 
          borderRadius: '10px', 
          padding: '12px 16px' 
        }}>
          <h4 style={{ 
            margin: '0 0 6px', 
            fontSize: '10px', 
            fontWeight: 700, 
            color: '#6d28d9', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="10" x2="12" y2="10"></line><line x1="12" y1="14" x2="12" y2="14"></line></svg>
            Instruções de Pagamento via Pix
          </h4>
          <p style={{ margin: '3px 0', fontSize: '13px', fontWeight: 700, color: brandPrimary }}>
            Chave Pix: <span style={{ color: brandAccent }}>{settings.pixKey}</span>
          </p>
          <p style={{ margin: 0, fontSize: '10px', color: '#4c1d95' }}>
            Tipo: <strong>{settings.pixType}</strong> &nbsp;|&nbsp; Titular: <strong>{settings.businessName}</strong>
          </p>
        </div>
      </div>

      {/* ── SIGNATURE BLOCKS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '10px', padding: '0 10px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: brandPrimary, fontWeight: 700 }}>Responsável Técnico</p>
            <p style={{ margin: '1px 0 0', fontSize: '9px', color: '#64748b' }}>{settings.businessName}</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: brandPrimary, fontWeight: 700 }}>Assinatura do Cliente</p>
            <p style={{ margin: '1px 0 0', fontSize: '9px', color: '#64748b' }}>Declaro recebido o serviço em perfeito estado</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP ── */}
      <div style={{
        marginTop: '35px',
        background: brandPrimary,
        borderRadius: '8px',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '9px' }}>
          Documento fiscalmente não equivalente a Nota Fiscal · Gerado por <strong style={{ color: '#fff' }}>{settings.systemName}</strong>
        </p>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '9px' }}>
          Ordem de Serviço #{order.id} &nbsp;·&nbsp; {dateLabel}
        </p>
      </div>
    </div>
  );
};

export default PrintOS;
