import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';

type Transacao = {
  data: string | Date;
  descricao: string;
  categoria?: { nome: string };
  valor: string | number;
  tipo: 'ENTRADA' | 'SAIDA';
};

export const create = async (req: Request, res: Response) => {
  try {
    const { periodo } = req.params;
    const { transacoes, nomeUsuario } = req.body as { transacoes: Transacao[]; nomeUsuario?: string; };

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      bufferPages: true,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=relatorio_${periodo}.pdf`);
    doc.pipe(res);

    const MARGEM_INFERIOR = 40;
    const COR_PRINCIPAL = '#003366';
    const COR_TEXTO = '#333333';
    const COR_BORDA = '#DDDDDD';
    const COR_FUNDO_CABECALHO_TABELA = '#F3F3F3';

    // Cabeçalho apenas na primeira página
    const gerarCabecalho = () => {
      doc
        .fillColor(COR_PRINCIPAL)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('Relatório Financeiro', { align: 'center' })
        .fontSize(12)
        .font('Helvetica')
        .fillColor(COR_TEXTO)
        .text(`Período de Referência: ${periodo}`, { align: 'center' });

      if (nomeUsuario) {
        doc.fontSize(10).text(`Usuário: ${nomeUsuario}`, { align: 'center' });
      }

      doc.moveDown(2);
    };

    const gerarTabela = (titulo: string, dados: Transacao[]) => {
      let y = doc.y;

      doc
        .fillColor(COR_PRINCIPAL)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(titulo);
      y = doc.y + 10;

      if (dados.length === 0) {
        doc.fontSize(10).font('Helvetica').fillColor(COR_TEXTO).text('Nenhuma transação registrada neste período.');
        doc.moveDown(2);
        return;
      }

      const LARGURA_DISPONIVEL = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const posicoes = {
        data: doc.page.margins.left,
        descricao: doc.page.margins.left + LARGURA_DISPONIVEL * 0.18,
        categoria: doc.page.margins.left + LARGURA_DISPONIVEL * 0.55,
        valor: doc.page.margins.left + LARGURA_DISPONIVEL * 0.8,
      };
      const larguras = {
        data: LARGURA_DISPONIVEL * 0.18,
        descricao: LARGURA_DISPONIVEL * 0.37,
        categoria: LARGURA_DISPONIVEL * 0.25,
        valor: LARGURA_DISPONIVEL * 0.2,
      };

      const gerarCabecalhoTabela = () => {
        doc
          .rect(doc.page.margins.left, y, LARGURA_DISPONIVEL, 20)
          .fill(COR_FUNDO_CABECALHO_TABELA);
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor(COR_PRINCIPAL);
        doc.text('Data', posicoes.data, y + 5, { width: larguras.data });
        doc.text('Descrição', posicoes.descricao, y + 5, { width: larguras.descricao });
        doc.text('Categoria', posicoes.categoria, y + 5, { width: larguras.categoria });
        doc.text('Valor (R$)', posicoes.valor, y + 5, { width: larguras.valor, align: 'right' });
        y += 25;
      };

      const gerarLinha = (item: Transacao, i: number) => {
        const alturaLinha = Math.max(
          doc.heightOfString(item.descricao, { width: larguras.descricao }),
          20
        );

        if (y + alturaLinha > doc.page.height - MARGEM_INFERIOR) {
          doc.addPage();
          y = doc.page.margins.top;
          gerarCabecalhoTabela();
          y = doc.y;
        }

        if (i % 2 !== 0) {
          doc.rect(doc.page.margins.left, y, LARGURA_DISPONIVEL, alturaLinha).fill('#F9F9F9');
        }

        const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const valorFormatado = parseFloat(String(item.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        doc.fontSize(10).font('Helvetica').fillColor(COR_TEXTO);
        doc.text(dataFormatada, posicoes.data, y + 5, { width: larguras.data });
        doc.text(item.descricao || '-', posicoes.descricao, y + 5, { width: larguras.descricao });
        doc.text(item.categoria?.nome || '-', posicoes.categoria, y + 5, { width: larguras.categoria });
        doc.text(valorFormatado, posicoes.valor, y + 5, { width: larguras.valor, align: 'right' });

        doc.moveTo(doc.page.margins.left, y + alturaLinha)
           .lineTo(doc.page.width - doc.page.margins.right, y + alturaLinha)
           .stroke(COR_BORDA);

        y += alturaLinha + 5;
      };

      gerarCabecalhoTabela();
      dados.forEach(gerarLinha);
      doc.y = y + 5;
      doc.moveDown(2);
    };

    const gerarResumo = () => {
      const entradas = transacoes.filter(t => t.tipo === 'ENTRADA');
      const saidas = transacoes.filter(t => t.tipo === 'SAIDA');
      const totalEntradas = entradas.reduce((acc, t) => acc + parseFloat(String(t.valor)), 0);
      const totalSaidas = saidas.reduce((acc, t) => acc + parseFloat(String(t.valor)), 0);
      const saldo = totalEntradas - totalSaidas;

      doc.fillColor(COR_PRINCIPAL).fontSize(14).font('Helvetica-Bold').text('Resumo Financeiro');
      doc.moveDown(1);

      const yInicialResumo = doc.y;
      const xCol1 = doc.page.margins.left;
      const xCol2 = doc.page.width / 2 + 20;

      const linhas = [
        { label: 'Total de Entradas:', valor: totalEntradas, cor: COR_TEXTO },
        { label: 'Total de Saídas:', valor: totalSaidas, cor: COR_TEXTO },
        { label: 'Saldo do Período:', valor: saldo, cor: saldo >= 0 ? 'green' : 'red', bold: true },
      ];

      let yAtual = yInicialResumo;
      linhas.forEach(l => {
        doc.font(l.bold ? 'Helvetica-Bold' : 'Helvetica')
           .fillColor(l.cor)
           .text(l.label, xCol1, yAtual);

        const valorFormatado = `R$ ${l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        doc.font('Helvetica-Bold').fillColor(l.cor).text(valorFormatado, xCol2, yAtual);

        yAtual += 16;
      });

      doc.y = yAtual + 10;
    };

    // Cabeçalho inicial
    gerarCabecalho();

    // Separar transações
    const entradas = transacoes.filter(t => t.tipo === 'ENTRADA');
    const saidas = transacoes.filter(t => t.tipo === 'SAIDA');

    // Gerar tabelas
    gerarTabela('Receitas (Entradas)', entradas);
    gerarTabela('Despesas (Saídas)', saidas);

    // Gerar resumo
    gerarResumo();

    doc.end();

  } catch (error: any) {
    console.error("Erro ao criar relatório", error);
    res.status(500).json({ message: "Erro interno do servidor", error: error.message || error });
  }
};
