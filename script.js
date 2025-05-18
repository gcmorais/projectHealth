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

    // Gráfico de Prática Regular por Faixa Etária
    const labels = ['18-30 anos', '31-45 anos', '46-60 anos', 'Acima de 60 anos'];
    const data = [85.7, 75, 62.5, 50];

    const ctx = document.getElementById('graficoFaixaEtaria');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Prática Regular (%)',
                    data: data,
                    backgroundColor: [
                        '#4caf50',
                        '#2196f3',
                        '#ffc107',
                        '#f44336'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#333'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Prática Regular de Atividade Física por Faixa Etária',
                        color: '#333',
                        font: {
                            size: 20
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Faixa Etária',
                            color: '#333'
                        },
                        ticks: { color: '#333' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Percentual (%)',
                            color: '#333'
                        },
                        min: 0,
                        max: 90,
                        ticks: { color: '#333' }
                    }
                }
            }
        });
    }
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

    // Fonte dos dados
    doc.setFontSize(10);
    doc.text('Dados retirados do site do projeto saúde (https://projeto-saude-snowy.vercel.app/)', 105, 37, { align: 'center' });

    // Texto introdutório
    doc.setFontSize(12);
    doc.text('Esta pesquisa analisou os hábitos e percepções relacionados à atividade física e sua influência na promoção da saúde. Os resultados apresentados abaixo representam as respostas de 43 participantes.', 20, 45, { maxWidth: 170 });

    // Tabela de resultados
    const tableData = [
        ['Categoria', 'Total', 'Percentual', 'Observações'],
        ['Prática Regular de Atividade Física', '33', '77%', 'Pelo menos 3 vezes por semana'],
        ['Tempo de Exercício Diário', '20', '47%', 'Entre 30 e 60 minutos'],
        ['Crença nos Benefícios', '40', '93%', 'Acreditam que melhora a saúde'],
        ['Interesse em Informações', '36', '84%', 'Busca informações sobre saúde'],
        ['Principais Atividades', '25', '58%', 'Caminhada e corrida']
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
        ['18-30 anos', '21', '85,7%', 'Alta adesão a esportes coletivos, corrida e uso de aplicativos fitness.'],
        ['31-45 anos', '12', '75%', 'Preferência por caminhada e musculação; falta de tempo é uma barreira comum.'],
        ['46-60 anos', '8', '62,5%', 'Foco em caminhadas e atividades leves; barreiras incluem motivação e saúde.'],
        ['Acima de 60 anos', '2', '50%', 'Atividades adaptadas como caminhada e alongamento; saúde é a principal barreira.']
    ];

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [ageData[0]],
        body: ageData.slice(1),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    // Adicionar o gráfico ao PDF
    const chartCanvas = document.getElementById('graficoFaixaEtaria');
    let campaignStartY;
    if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL('image/png', 1.0);
        // Largura máxima do gráfico no PDF
        const imgWidth = 170;
        const imgHeight = (chartCanvas.height / chartCanvas.width) * imgWidth;
        // Verifica se há espaço suficiente na página, senão adiciona nova página
        let posY = doc.lastAutoTable.finalY + 40;
        if (posY + imgHeight > 270) { // 270 é um limite seguro para A4 retrato
            doc.addPage();
            posY = 20;
        }
        doc.setFontSize(14);
        doc.text('Gráfico: Prática Regular de Atividade Física por Faixa Etária', 20, posY);
        doc.addImage(chartImage, 'PNG', 20, posY + 5, imgWidth, imgHeight);
        // Atualiza a posição para o próximo bloco
        campaignStartY = posY + 5 + imgHeight + 20;
    } else {
        campaignStartY = doc.lastAutoTable.finalY + 30;
    }

    // Informações da Campanha
    doc.setFontSize(14);
    doc.text('Detalhes da Campanha', 20, campaignStartY);
    
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

    doc.text(campaignInfo, 20, campaignStartY + 10);

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