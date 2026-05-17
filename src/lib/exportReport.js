import { jsPDF } from 'jspdf';

function replaceRoleText(text) {
  if (!text) return '';
  return String(text).replace(
    /intern begeleider/gi,
    'intern begeleider / kwaliteitscoördinator'
  );
}

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(text) {
  return String(text || 'leerling')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'leerling';
}

function formatProfileHeading(profile) {
  if (!profile) return 'Geen duidelijke profielrichting zichtbaar';
  return `${profile.shortTitle} - ${profile.title}`;
}

function buildReportData({
  student,
  zoovSignal,
  contextInput,
  homeInput,
  testScores,
  interpretation,
  advice,
  bestProfile,
  overlapProfile
}) {
  return {
    student: {
      name: student?.name || '-',
      group: student?.group || '-',
      observer: student?.observer || '-',
      date: student?.date || '-'
    },
    aanleiding: {
      zoov: zoovSignal?.status === 'yes'
        ? 'Ja, ZOOV+ gaf aanleiding tot nadere observatie'
        : zoovSignal?.status === 'no'
          ? 'Nee, geen ZOOV+ startsignaal'
          : 'Niet ingevuld',
      note: zoovSignal?.note || '-'
    },
    profielduiding: {
      bestProfile: formatProfileHeading(bestProfile),
      overlapProfile: overlapProfile ? formatProfileHeading(overlapProfile) : '',
      workHypothesis: replaceRoleText(advice?.workHypothesis || ''),
      shortInterpretation: replaceRoleText(advice?.shortInterpretation || ''),
      overlapNote: overlapProfile
        ? 'Profieloverlap is mogelijk. Profielen zijn geen vaste labels. Deze uitkomst is bedoeld als ondersteuning bij interpretatie en handelen.'
        : ''
    },
    toetsgegevens: Object.entries(testScores || {}).map(([key, value]) => ({
      label:
        key === 'dmt' ? 'DMT' :
        key === 'avi' ? 'AVI' :
        key === 'begrijpendLezen' ? 'Begrijpend lezen' :
        key === 'rekenen' ? 'Rekenen' :
        key === 'spelling' ? 'Spelling' : key,
      value:
        value === 'veryStrong' ? 'Zeer sterk' :
        value === 'strong' ? 'Sterk' :
        value === 'average' ? 'Gemiddeld' :
        value === 'vulnerable' ? 'Kwetsbaar' :
        value === 'weak' ? 'Zwak' :
        'Niet ingevuld'
    })),
    context: {
      knownSupportInfo:
        contextInput?.knownSupportInfoPresence === 'yes'
          ? 'Ja, er is bekende relevante ondersteuningsinformatie'
          : contextInput?.knownSupportInfoPresence === 'no'
            ? 'Nee, er is geen bekende relevante ondersteuningsinformatie'
            : 'Niet ingevuld',
      knownSupportInfoNote: contextInput?.knownSupportInfoNote || '-',
      settingDifference:
        contextInput?.settingDifference && contextInput.settingDifference !== 'unknown'
          ? contextInput.settingDifference
          : 'Niet ingevuld',
      homePattern:
        homeInput?.pattern === 'confirm'
          ? 'Thuissituatie lijkt het schoolbeeld grotendeels te bevestigen'
          : homeInput?.pattern === 'contrast'
            ? 'Thuissituatie contrasteert met het schoolbeeld'
            : 'Niet ingevuld',
      homeSummary: homeInput?.summary || '-'
    },
    prestatiebeeld: replaceRoleText(interpretation?.performanceSummary || ''),
    discrepantieIntro:
      'Verschillen tussen observaties en toetsgegevens kunnen wijzen op onderpresteren, wisselend functioneren of maskering. Deze duiding is ondersteunend en niet-diagnostisch.',
    discrepanties:
      interpretation?.discrepancySignals?.length
        ? interpretation.discrepancySignals.map((item) => replaceRoleText(item))
        : ['Er zijn op basis van de huidige invoer nog geen expliciete discrepantiesignalen zichtbaar.'],
    onderwijsbehoeften:
      advice?.prioritizedNeeds?.map((item) => ({
        area: item.area,
        need: replaceRoleText(item.need),
        advice: replaceRoleText(item.advice),
        sharedByOverlap: Boolean(item.sharedByOverlap)
      })) || [],
    vervolg:
      [
        ...(advice?.followUpSteps || []).map((item) => replaceRoleText(item)),
        ...(advice?.homeAttention
          ? [`Thuissituatie als aandachtspunt: ${replaceRoleText(advice.homeAttention)}`]
          : [])
      ],
    caution: replaceRoleText(advice?.caution || ''),
    fileBaseName: `werkhypothese-${slugify(student?.name)}`
  };
}

function createDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildWordHtml(data) {
  const rows = data.toetsgegevens
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(item.value)}</td>
        </tr>
      `
    )
    .join('');

  const needs = data.onderwijsbehoeften
    .map(
      (item) => `
        <div class="card">
          <div class="card-head">
            <strong>${escapeHtml(item.area)}</strong>
            ${item.sharedByOverlap ? '<span class="tag">Extra relevant bij overlap</span>' : ''}
          </div>
          <p><strong>Onderwijsbehoefte:</strong> ${escapeHtml(item.need)}</p>
          <p><strong>Advies:</strong> ${escapeHtml(item.advice)}</p>
        </div>
      `
    )
    .join('');

  const discrepanties = data.discrepanties
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const vervolg = data.vervolg.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>Werkhypothese profiel en onderwijsbehoefte</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1f2937; margin: 24px; }
          h1, h2, h3, p { margin: 0; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          h2 { font-size: 18px; margin: 22px 0 10px; }
          p { line-height: 1.5; margin-top: 8px; }
          .subtle { color: #4b5563; }
          .grid { width: 100%; }
          .card {
            border: 1px solid #dbe3ec;
            border-radius: 12px;
            padding: 12px;
            margin-top: 10px;
          }
          .card-head { margin-bottom: 8px; }
          .tag {
            display: inline-block;
            margin-left: 8px;
            padding: 3px 8px;
            border: 1px solid #dbe3ec;
            border-radius: 999px;
            font-size: 11px;
            color: #355f86;
            background: #eef4fa;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 0;
            vertical-align: top;
          }
          ul { margin-top: 8px; }
          li { margin-bottom: 6px; }
          .note {
            background: #f8fafc;
            border: 1px solid #dbe3ec;
            border-radius: 12px;
            padding: 12px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Werkhypothese profiel en onderwijsbehoefte</h1>
        <p class="subtle">Export voor bespreking met collega’s, ouders of andere betrokkenen.</p>

        <h2>Leerlinggegevens</h2>
        <p><strong>Naam:</strong> ${escapeHtml(data.student.name)}</p>
        <p><strong>Groep:</strong> ${escapeHtml(data.student.group)}</p>
        <p><strong>Ingevuld door:</strong> ${escapeHtml(data.student.observer)}</p>
        <p><strong>Datum:</strong> ${escapeHtml(data.student.date)}</p>

        <h2>Aanleiding</h2>
        <p><strong>ZOOV+:</strong> ${escapeHtml(data.aanleiding.zoov)}</p>
        <p><strong>Notitie:</strong> ${escapeHtml(data.aanleiding.note)}</p>

        <h2>Profielduiding</h2>
        <p><strong>Best passend profiel:</strong> ${escapeHtml(data.profielduiding.bestProfile)}</p>
        ${data.profielduiding.overlapProfile ? `<p><strong>Overlap:</strong> ${escapeHtml(data.profielduiding.overlapProfile)}</p>` : ''}
        <p><strong>Werkhypothese:</strong> ${escapeHtml(data.profielduiding.workHypothesis)}</p>
        <p>${escapeHtml(data.profielduiding.shortInterpretation)}</p>
        ${
          data.profielduiding.overlapNote
            ? `<div class="note"><strong>Profieloverlap</strong><p>${escapeHtml(data.profielduiding.overlapNote)}</p></div>`
            : ''
        }

        <h2>Toetsgegevens</h2>
        <table>${rows}</table>

        <h2>Aanvullende context</h2>
        <p><strong>Bekende ondersteuningsinformatie:</strong> ${escapeHtml(data.context.knownSupportInfo)}</p>
        <p><strong>Dossiernotitie:</strong> ${escapeHtml(data.context.knownSupportInfoNote)}</p>
        <p><strong>Verschillen tussen settings:</strong> ${escapeHtml(data.context.settingDifference)}</p>
        <p><strong>Thuissituatie:</strong> ${escapeHtml(data.context.homePattern)}</p>
        <p><strong>Samenvatting thuissituatie:</strong> ${escapeHtml(data.context.homeSummary)}</p>

        <h2>Prestatiebeeld en discrepanties</h2>
        <p>${escapeHtml(data.prestatiebeeld)}</p>
        <p>${escapeHtml(data.discrepantieIntro)}</p>
        <ul>${discrepanties}</ul>

        <h2>Onderwijsbehoeften en adviezen</h2>
        ${needs}

        <h2>Vervolg</h2>
        <ul>${vervolg}</ul>

        <h2>Kanttekening</h2>
        <div class="note">
          <p>${escapeHtml(data.caution)}</p>
          <p>Dit is geen diagnose.</p>
        </div>
      </body>
    </html>
  `;
}

export function downloadWordReport(reportInput) {
  const data = buildReportData(reportInput);
  const html = buildWordHtml(data);
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  createDownload(blob, `${data.fileBaseName}.doc`);
}

function createPdfWriter(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (heightNeeded = 20) => {
    if (y + heightNeeded <= pageHeight - margin) return;
    doc.addPage();
    y = margin;
  };

  const addTitle = (text) => {
    ensureSpace(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(text, margin, y);
    y += 26;
  };

  const addSection = (text) => {
    ensureSpace(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(text, margin, y);
    y += 18;
  };

  const addParagraph = (text, indent = 0) => {
    const clean = String(text || '');
    const lines = doc.splitTextToSize(clean, contentWidth - indent);
    ensureSpace(lines.length * 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(lines, margin + indent, y);
    y += lines.length * 14 + 4;
  };

  const addLabelValue = (label, value) => {
    addParagraph(`${label} ${value}`);
  };

  const addList = (items) => {
    items.forEach((item) => {
      const clean = String(item || '');
      const lines = doc.splitTextToSize(clean, contentWidth - 14);
      ensureSpace(lines.length * 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('•', margin, y);
      doc.text(lines, margin + 12, y);
      y += lines.length * 14 + 2;
    });
    y += 2;
  };

  const addSpacer = (amount = 8) => {
    y += amount;
  };

  return {
    addTitle,
    addSection,
    addParagraph,
    addLabelValue,
    addList,
    addSpacer
  };
}

export function downloadPdfReport(reportInput) {
  const data = buildReportData(reportInput);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const writer = createPdfWriter(doc);

  writer.addTitle('Werkhypothese profiel en onderwijsbehoefte');
  writer.addParagraph(
    'Export voor bespreking met collega’s, ouders of andere betrokkenen.'
  );

  writer.addSection('Leerlinggegevens');
  writer.addLabelValue('Naam:', data.student.name);
  writer.addLabelValue('Groep:', data.student.group);
  writer.addLabelValue('Ingevuld door:', data.student.observer);
  writer.addLabelValue('Datum:', data.student.date);

  writer.addSection('Aanleiding');
  writer.addLabelValue('ZOOV+:', data.aanleiding.zoov);
  writer.addLabelValue('Notitie:', data.aanleiding.note);

  writer.addSection('Profielduiding');
  writer.addLabelValue('Best passend profiel:', data.profielduiding.bestProfile);
  if (data.profielduiding.overlapProfile) {
    writer.addLabelValue('Overlap:', data.profielduiding.overlapProfile);
  }
  writer.addLabelValue('Werkhypothese:', data.profielduiding.workHypothesis);
  writer.addParagraph(data.profielduiding.shortInterpretation);
  if (data.profielduiding.overlapNote) {
    writer.addSpacer(4);
    writer.addParagraph(`Profieloverlap: ${data.profielduiding.overlapNote}`);
  }

  writer.addSection('Toetsgegevens');
  data.toetsgegevens.forEach((item) => {
    writer.addLabelValue(`${item.label}:`, item.value);
  });

  writer.addSection('Aanvullende context');
  writer.addLabelValue(
    'Bekende ondersteuningsinformatie:',
    data.context.knownSupportInfo
  );
  writer.addLabelValue('Dossiernotitie:', data.context.knownSupportInfoNote);
  writer.addLabelValue(
    'Verschillen tussen settings:',
    data.context.settingDifference
  );
  writer.addLabelValue('Thuissituatie:', data.context.homePattern);
  writer.addLabelValue(
    'Samenvatting thuissituatie:',
    data.context.homeSummary
  );

  writer.addSection('Prestatiebeeld en discrepanties');
  writer.addParagraph(data.prestatiebeeld);
  writer.addParagraph(data.discrepantieIntro);
  writer.addList(data.discrepanties);

  writer.addSection('Onderwijsbehoeften en adviezen');
  data.onderwijsbehoeften.forEach((item) => {
    writer.addParagraph(
      `${item.area}${item.sharedByOverlap ? ' (extra relevant bij overlap)' : ''}`
    );
    writer.addParagraph(`Onderwijsbehoefte: ${item.need}`, 10);
    writer.addParagraph(`Advies: ${item.advice}`, 10);
    writer.addSpacer(4);
  });

  writer.addSection('Vervolg');
  writer.addList(data.vervolg);

  writer.addSection('Kanttekening');
  writer.addParagraph(data.caution);
  writer.addParagraph('Dit is geen diagnose.');

  doc.save(`${data.fileBaseName}.pdf`);
}
