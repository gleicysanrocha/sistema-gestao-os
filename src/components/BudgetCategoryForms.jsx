import React from 'react';
import { Smartphone, Laptop, Code, Globe, Bot, Cpu } from 'lucide-react';

export const CATEGORIES = [
  { id: 'celular', label: 'Manutenção de Celular', icon: Smartphone, color: '#6366f1' },
  { id: 'notebook', label: 'Manutenção de Notebook', icon: Laptop, color: '#3b82f6' },
  { id: 'computador', label: 'Montagem de Computador', icon: Cpu, color: '#06b6d4' },
  { id: 'sistema', label: 'Projeto de Sistema', icon: Code, color: '#8b5cf6' },
  { id: 'site', label: 'Criação de Site', icon: Globe, color: '#10b981' },
  { id: 'automacao', label: 'Automação', icon: Bot, color: '#f59e0b' },
];


const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
      {label}
    </label>
    {children}
  </div>
);

const grid2 = { display: 'grid', gridTemplateColumns: 'var(--grid-columns, 1fr 1fr)', gap: 'var(--grid-gap, 15px)' };

export function CelularForm({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div style={grid2}>
        <Field label="Marca / Modelo">
          <input className="input-field" placeholder="Ex: Samsung Galaxy A54" value={data.modelo || ''} onChange={e => f('modelo', e.target.value)} />
        </Field>
        <Field label="IMEI / Número de Série">
          <input className="input-field" placeholder="Ex: 35924..." value={data.imei || ''} onChange={e => f('imei', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Problema Relatado">
          <input className="input-field" placeholder="Ex: Tela quebrada" value={data.problema || ''} onChange={e => f('problema', e.target.value)} />
        </Field>
        <Field label="Serviço a Executar">
          <select className="input-field" value={data.servico || ''} onChange={e => f('servico', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Troca de Tela</option>
            <option>Troca de Bateria</option>
            <option>Troca de Conector de Carga</option>
            <option>Formatação / Reset</option>
            <option>Reparo na Placa</option>
            <option>Troca de Câmera</option>
            <option>Limpeza Interna</option>
            <option>Outro</option>
          </select>
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Condição da Peça">
          <select className="input-field" value={data.pecaCondicao || ''} onChange={e => f('pecaCondicao', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Original</option>
            <option>Compatível Premium</option>
            <option>Compatível Padrão</option>
            <option>Sem peça (mão de obra)</option>
          </select>
        </Field>
        <Field label="Prazo Estimado">
          <select className="input-field" value={data.prazo || ''} onChange={e => f('prazo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>No mesmo dia</option>
            <option>24 horas</option>
            <option>2-3 dias úteis</option>
            <option>5-7 dias úteis</option>
          </select>
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Valor da Peça (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorPeca || ''} onChange={e => f('valorPeca', e.target.value)} />
        </Field>
        <Field label="Mão de Obra (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorMaoObra || ''} onChange={e => f('valorMaoObra', e.target.value)} />
        </Field>
      </div>
      <Field label="Observações Adicionais">
        <textarea className="input-field" style={{ minHeight: 70 }} placeholder="Estado do aparelho, arranhões, etc." value={data.obs || ''} onChange={e => f('obs', e.target.value)} />
      </Field>
    </div>
  );
}

export function NotebookForm({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div style={grid2}>
        <Field label="Marca / Modelo">
          <input className="input-field" placeholder="Ex: Dell Inspiron 15" value={data.modelo || ''} onChange={e => f('modelo', e.target.value)} />
        </Field>
        <Field label="Número de Série">
          <input className="input-field" placeholder="Ex: ABC12345" value={data.serial || ''} onChange={e => f('serial', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Sistema Operacional">
          <select className="input-field" value={data.so || ''} onChange={e => f('so', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Windows 10</option>
            <option>Windows 11</option>
            <option>macOS</option>
            <option>Linux</option>
          </select>
        </Field>
        <Field label="Tipo de Serviço">
          <select className="input-field" value={data.servico || ''} onChange={e => f('servico', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Formatação e Reinstalação</option>
            <option>Troca de HD/SSD</option>
            <option>Upgrade de Memória RAM</option>
            <option>Troca de Tela</option>
            <option>Troca de Bateria</option>
            <option>Limpeza e Pasta Térmica</option>
            <option>Reparo na Placa-mãe</option>
            <option>Configuração / Setup</option>
            <option>Remoção de Vírus</option>
            <option>Outro</option>
          </select>
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Configuração Atual">
          <input className="input-field" placeholder="Ex: i5, 8GB RAM, 256 SSD" value={data.config || ''} onChange={e => f('config', e.target.value)} />
        </Field>
        <Field label="Prazo Estimado">
          <select className="input-field" value={data.prazo || ''} onChange={e => f('prazo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>No mesmo dia</option>
            <option>24 horas</option>
            <option>2-3 dias úteis</option>
            <option>5-7 dias úteis</option>
          </select>
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Valor das Peças (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorPeca || ''} onChange={e => f('valorPeca', e.target.value)} />
        </Field>
        <Field label="Mão de Obra (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorMaoObra || ''} onChange={e => f('valorMaoObra', e.target.value)} />
        </Field>
      </div>
      <Field label="Problema Relatado / Observações">
        <textarea className="input-field" style={{ minHeight: 70 }} placeholder="Descreva o problema..." value={data.obs || ''} onChange={e => f('obs', e.target.value)} />
      </Field>
    </div>
  );
}

export function SistemaForm({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <Field label="Nome do Projeto">
        <input className="input-field" placeholder="Ex: Sistema de Gestão de Estoque" value={data.nomeProjeto || ''} onChange={e => f('nomeProjeto', e.target.value)} />
      </Field>
      <div style={grid2}>
        <Field label="Tipo de Sistema">
          <select className="input-field" value={data.tipo || ''} onChange={e => f('tipo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Web App</option>
            <option>App Mobile</option>
            <option>Desktop</option>
            <option>API / Backend</option>
            <option>Dashboard / Relatórios</option>
            <option>ERP / CRM</option>
            <option>E-commerce</option>
          </select>
        </Field>
        <Field label="Prazo Desejado">
          <select className="input-field" value={data.prazo || ''} onChange={e => f('prazo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Até 2 semanas</option>
            <option>1 mês</option>
            <option>2-3 meses</option>
            <option>Mais de 3 meses</option>
            <option>A definir</option>
          </select>
        </Field>
      </div>
      <Field label="Funcionalidades Principais">
        <textarea className="input-field" style={{ minHeight: 80 }} placeholder="Ex: Cadastro de produtos, controle de estoque, emissão de relatórios..." value={data.funcionalidades || ''} onChange={e => f('funcionalidades', e.target.value)} />
      </Field>
      <div style={grid2}>
        <Field label="Tecnologia Preferida">
          <input className="input-field" placeholder="Ex: React, Node.js..." value={data.tecnologia || ''} onChange={e => f('tecnologia', e.target.value)} />
        </Field>
        <Field label="Integrações Necessárias">
          <input className="input-field" placeholder="Ex: WhatsApp, Pix, ERP..." value={data.integracoes || ''} onChange={e => f('integracoes', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Modelo de Contrato">
          <select className="input-field" value={data.contrato || ''} onChange={e => f('contrato', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Projeto Fechado</option>
            <option>Por Hora</option>
            <option>Mensalidade</option>
          </select>
        </Field>
        <Field label="Valor Estimado (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorEstimado || ''} onChange={e => f('valorEstimado', e.target.value)} />
        </Field>
      </div>
      <Field label="Requisitos Adicionais">
        <textarea className="input-field" style={{ minHeight: 60 }} placeholder="Segurança, hospedagem, suporte..." value={data.obs || ''} onChange={e => f('obs', e.target.value)} />
      </Field>
    </div>
  );
}

export function SiteForm({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div style={grid2}>
        <Field label="Nome do Site / Empresa">
          <input className="input-field" placeholder="Ex: Loja da Maria" value={data.nomeSite || ''} onChange={e => f('nomeSite', e.target.value)} />
        </Field>
        <Field label="Tipo de Site">
          <select className="input-field" value={data.tipo || ''} onChange={e => f('tipo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Landing Page</option>
            <option>Site Institucional</option>
            <option>E-commerce</option>
            <option>Blog / Portal</option>
            <option>Site de Portfólio</option>
            <option>Site de Agendamento</option>
          </select>
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Número de Páginas">
          <select className="input-field" value={data.paginas || ''} onChange={e => f('paginas', e.target.value)}>
            <option value="">Selecione...</option>
            <option>1 página (Landing)</option>
            <option>3-5 páginas</option>
            <option>6-10 páginas</option>
            <option>Mais de 10 páginas</option>
          </select>
        </Field>
        <Field label="Prazo Desejado">
          <select className="input-field" value={data.prazo || ''} onChange={e => f('prazo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>1 semana</option>
            <option>2 semanas</option>
            <option>1 mês</option>
            <option>A definir</option>
          </select>
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Domínio e Hospedagem">
          <select className="input-field" value={data.hospedagem || ''} onChange={e => f('hospedagem', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Cliente já possui</option>
            <option>Incluir no orçamento</option>
            <option>Apenas orientação</option>
          </select>
        </Field>
        <Field label="Design">
          <select className="input-field" value={data.design || ''} onChange={e => f('design', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Cliente fornece referências</option>
            <option>Criar do zero</option>
            <option>Template customizado</option>
          </select>
        </Field>
      </div>
      <Field label="Funcionalidades / Recursos">
        <textarea className="input-field" style={{ minHeight: 70 }} placeholder="Ex: Formulário de contato, WhatsApp, galeria, mapa..." value={data.funcionalidades || ''} onChange={e => f('funcionalidades', e.target.value)} />
      </Field>
      <div style={grid2}>
        <Field label="Incluir SEO?">
          <select className="input-field" value={data.seo || ''} onChange={e => f('seo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Sim</option>
            <option>Não</option>
          </select>
        </Field>
        <Field label="Valor Estimado (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorEstimado || ''} onChange={e => f('valorEstimado', e.target.value)} />
        </Field>
      </div>
      <Field label="Observações">
        <textarea className="input-field" style={{ minHeight: 60 }} placeholder="Referências de sites, cores, estilo..." value={data.obs || ''} onChange={e => f('obs', e.target.value)} />
      </Field>
    </div>
  );
}

export function AutomacaoForm({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <Field label="Nome / Objetivo da Automação">
        <input className="input-field" placeholder="Ex: Bot de atendimento no WhatsApp" value={data.nomeAutomacao || ''} onChange={e => f('nomeAutomacao', e.target.value)} />
      </Field>
      <div style={grid2}>
        <Field label="Tipo de Automação">
          <select className="input-field" value={data.tipo || ''} onChange={e => f('tipo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Bot WhatsApp</option>
            <option>Bot Instagram / Redes Sociais</option>
            <option>Automação de Planilhas</option>
            <option>Integração entre Sistemas</option>
            <option>RPA (Robô de Processos)</option>
            <option>Notificações Automáticas</option>
            <option>Scraping de Dados</option>
            <option>Outro</option>
          </select>
        </Field>
        <Field label="Plataforma / Ferramenta">
          <input className="input-field" placeholder="Ex: Make, n8n, Python..." value={data.plataforma || ''} onChange={e => f('plataforma', e.target.value)} />
        </Field>
      </div>
      <Field label="Processo a Automatizar">
        <textarea className="input-field" style={{ minHeight: 80 }} placeholder="Descreva o processo atual e o que deseja automatizar..." value={data.processo || ''} onChange={e => f('processo', e.target.value)} />
      </Field>
      <div style={grid2}>
        <Field label="Volume Estimado">
          <input className="input-field" placeholder="Ex: 500 mensagens/dia" value={data.volume || ''} onChange={e => f('volume', e.target.value)} />
        </Field>
        <Field label="Integrações Necessárias">
          <input className="input-field" placeholder="Ex: Google Sheets, CRM..." value={data.integracoes || ''} onChange={e => f('integracoes', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Modelo de Contrato">
          <select className="input-field" value={data.contrato || ''} onChange={e => f('contrato', e.target.value)}>
            <option value="">Selecione...</option>
            <option>Projeto único</option>
            <option>Mensalidade (manutenção)</option>
            <option>Por demanda</option>
          </select>
        </Field>
        <Field label="Valor Estimado (R$)">
          <input className="input-field" type="number" placeholder="0,00" value={data.valorEstimado || ''} onChange={e => f('valorEstimado', e.target.value)} />
        </Field>
      </div>
      <Field label="Observações">
        <textarea className="input-field" style={{ minHeight: 60 }} placeholder="Detalhes adicionais, urgência, restrições..." value={data.obs || ''} onChange={e => f('obs', e.target.value)} />
      </Field>
    </div>
  );
}

export function ComputadorForm({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div style={grid2}>
        <Field label="Processador (CPU)">
          <input className="input-field" placeholder="Ex: Intel i7-13700K / Ryzen 7 7800X3D" value={data.cpu || ''} onChange={e => f('cpu', e.target.value)} />
        </Field>
        <Field label="Placa-Mãe">
          <input className="input-field" placeholder="Ex: ASUS ROG Strix B650-A" value={data.placaMae || ''} onChange={e => f('placaMae', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Memória RAM">
          <input className="input-field" placeholder="Ex: 32GB DDR5 6000MHz (2x16GB)" value={data.ram || ''} onChange={e => f('ram', e.target.value)} />
        </Field>
        <Field label="Placa de Vídeo (GPU)">
          <input className="input-field" placeholder="Ex: RTX 4070 Ti Super 16GB" value={data.gpu || ''} onChange={e => f('gpu', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Armazenamento (SSD/HD)">
          <input className="input-field" placeholder="Ex: SSD 2TB NVMe M.2 Kingston" value={data.armazenamento || ''} onChange={e => f('armazenamento', e.target.value)} />
        </Field>
        <Field label="Fonte de Alimentação">
          <input className="input-field" placeholder="Ex: Corsair RM850x 850W 80 Plus Gold" value={data.fonte || ''} onChange={e => f('fonte', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Gabinete">
          <input className="input-field" placeholder="Ex: Lian Li O11 Dynamic" value={data.gabinete || ''} onChange={e => f('gabinete', e.target.value)} />
        </Field>
        <Field label="Cooler / Refrigeração">
          <input className="input-field" placeholder="Ex: Water Cooler Corsair H150i 360mm" value={data.cooler || ''} onChange={e => f('cooler', e.target.value)} />
        </Field>
      </div>
      <div style={grid2}>
        <Field label="Prazo Estimado">
          <select className="input-field" value={data.prazo || ''} onChange={e => f('prazo', e.target.value)}>
            <option value="">Selecione...</option>
            <option>No mesmo dia</option>
            <option>24 horas</option>
            <option>2-3 dias úteis</option>
            <option>5-7 dias úteis</option>
          </select>
        </Field>
        <div style={grid2}>
          <Field label="Valor das Peças (R$)">
            <input className="input-field" type="number" placeholder="0,00" value={data.valorPeca || ''} onChange={e => f('valorPeca', e.target.value)} />
          </Field>
          <Field label="Mão de Obra (R$)">
            <input className="input-field" type="number" placeholder="0,00" value={data.valorMaoObra || ''} onChange={e => f('valorMaoObra', e.target.value)} />
          </Field>
        </div>
      </div>
      <Field label="Observações Adicionais / Outros Componentes">
        <textarea className="input-field" style={{ minHeight: 70 }} placeholder="Ex: Sistema operacional a instalar, ventoinhas extras, cabos customizados, etc." value={data.obs || ''} onChange={e => f('obs', e.target.value)} />
      </Field>
    </div>
  );
}

