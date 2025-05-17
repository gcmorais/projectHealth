document.addEventListener('DOMContentLoaded', () => {
    // Adiciona efeito de hover nos cards
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.1)';
            card.style.zIndex = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.zIndex = '0';
        });
    });

    // Adiciona efeito de scroll suave para os links do menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Adiciona efeito de parallax no scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        cards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            card.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});

// Função para gerar e baixar o PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título
    doc.setFontSize(24);
    doc.text('Resultados da Pesquisa', 105, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(16);
    doc.text('Atividade Física e Saúde', 105, 30, { align: 'center' });

    // Texto introdutório
    doc.setFontSize(12);
    doc.text('Esta pesquisa analisou os hábitos e percepções relacionados à atividade física e sua influência na promoção da saúde. Os resultados apresentados abaixo representam as respostas de 43 participantes.', 20, 45, { maxWidth: 170 });

    // Tabela de resultados
    const tableData = [
        ['Categoria', 'Total', 'Percentual', 'Observações'],
        ['Prática Regular', '34', '78%', 'Pelo menos 3 vezes por semana'],
        ['Tempo Diário', '19', '45%', 'Entre 30 e 60 minutos'],
        ['Crença nos Benefícios', '40', '92%', 'Acreditam que melhora a saúde'],
        ['Interesse em Informações', '37', '85%', 'Busca informações sobre saúde'],
        ['Principais Atividades', '26', '60%', 'Caminhada e corrida']
    ];

    doc.autoTable({
        startY: 60,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    // Distribuição por Faixa Etária
    doc.setFontSize(14);
    doc.text('Distribuição por Faixa Etária', 20, doc.lastAutoTable.finalY + 20);
    
    const ageData = [
        ['Faixa Etária', 'Total', 'Prática Regular', 'Observações'],
        ['18-30 anos', '17', '85%', 'Maior uso de aplicativos fitness'],
        ['31-45 anos', '14', '75%', 'Preferência por atividades ao ar livre'],
        ['46-60 anos', '9', '65%', 'Foco em caminhadas e alongamentos'],
        ['Acima de 60 anos', '3', '40%', 'Atividades adaptadas à idade']
    ];

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [ageData[0]],
        body: ageData.slice(1),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    // Informações da Campanha
    doc.setFontSize(14);
    doc.text('Detalhes da Campanha', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    const campaignInfo = [
        'Local: Em frente a Comunidade Espírita Irmã Scheilla',
        'Período: Coleta de dados na 2ª Semana',
        'Total de Participantes: 43 pessoas',
        '',
        'A pesquisa foi realizada através de questionários que incluíam:',
        '• Perguntas sobre hábitos de atividade física',
        '• Preferências por tipos de exercícios',
        '• Percepções sobre benefícios à saúde',
        '• Barreiras encontradas para a prática'
    ];

    doc.text(campaignInfo, 20, doc.lastAutoTable.finalY + 30);

    // Nova página para metodologia
    doc.addPage();
    
    doc.setFontSize(20);
    doc.text('Metodologia da Pesquisa', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    const methodologyText = [
        'A pesquisa foi conduzida através de questionários, com foco em:',
        '• Hábitos de atividade física',
        '• Tempo dedicado aos exercícios',
        '• Percepções sobre benefícios à saúde',
        '• Principais atividades praticadas',
        '• Busca por informações sobre saúde',
        '',
        'Os dados foram coletados de 43 participantes, com idade entre 18 e 65 anos.',
    ];

    doc.text(methodologyText, 20, 40);

    // Salvar o PDF
    doc.save('resultados_pesquisa_atividade_fisica.pdf');
} 