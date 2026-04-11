const profiles = [
  {
    id: 'type1',
    shortTitle: 'Type 1',
    title: 'Aangepast succesvol',
    description:
      'Deze leerling past zich goed aan het schoolsysteem aan, presteert vaak netjes en valt daardoor niet snel op als leerling met specifieke onderwijsbehoeften.',
    interpretation:
      'De leerling functioneert zichtbaar goed, maar heeft vaak meer behoefte aan echte uitdaging, zelfstandigheid en leerdurf dan het aangepaste succes laat zien.',
    matrix1: {
      gevoelens:
        'Wil het graag goed doen, is gevoelig voor verwachtingen van anderen en kan perfectionistisch, foutgevoelig en bevestigingsgericht reageren.',
      gedrag:
        'Werkt netjes, volgt instructies, levert verzorgd werk in en laat weinig storend gedrag zien, maar kiest vaak voor de veilige weg.',
      behoeften:
        'Heeft behoefte aan echte uitdaging, ruimte voor eigen keuzes, groei in zelfstandige leerstrategieën, creativiteit en een meer groeigerichte kijk op intelligentie.',
      signalen:
        'Valt in de klas vaak positief op door goede resultaten en taakgericht gedrag, waardoor onderliggende verveling of risicomijding minder snel wordt herkend.',
      begeleiding:
        'De begeleiding richt zich op een verschuiving van aangepast succes naar onafhankelijker leren en werken buiten de comfortzone.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'Heeft baat bij instructie die snel zichtbaar maakt wat al beheerst wordt en daarna ruimte laat voor zelfstandig en verdiepend verder werken.',
        advice:
          'Check vooraf kort wat de leerling al beheerst en voorkom onnodig lange of herhaalde instructie wanneer de basis al duidelijk is.',
        sources: 'Reis & Renzulli'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'Heeft baat bij opdrachten die verder gaan dan herhaling en reproductie en die vragen om denkdiepte, eigen keuzes en werken buiten de veilige standaardroute.',
        advice:
          'Compact beheerste leerstof en bied daarna opdrachten aan die niet volledig zijn dichtgetimmerd, maar waarin de leerling moet kiezen, onderbouwen en omgaan met cognitieve inspanning.',
        sources: 'Reis & Renzulli; Reis, Renzulli & Renzulli'
      },
      {
        area: 'Leeractiviteiten',
        need: 'Heeft baat bij leeractiviteiten waarin niet alleen het eindantwoord telt, maar ook planning, aanpak, monitoring en redenering.',
        advice:
          'Laat de leerling verwoorden hoe hij iets heeft aangepakt, waar hij moest nadenken en welke keuzes hij maakte.',
        sources: 'Efklides; Reis, Renzulli & Renzulli'
      },
      {
        area: 'Feedback',
        need: 'Heeft baat bij feedback die minder gericht is op bevestiging en meer op werkelijke inspanning, strategiegebruik en volgende groeistappen.',
        advice:
          'Richt feedback op de gekozen aanpak, benoem waar het werk nog veilig bleef en maak zichtbaar welke volgende stap meer zelfstandigheid vraagt.',
        sources: 'Efklides; Hornstra e.a.; Makel e.a.'
      },
      {
        area: 'Leeromgeving',
        need: 'Heeft baat bij een leeromgeving waarin uitdaging normaal is en fouten niet direct als mislukking worden beleefd.',
        advice:
          'Normaliseer dat lastig werk, proberen en herzien bij leren horen en niet hetzelfde zijn als falen.',
        sources: 'Dixon e.a.; Grugan e.a.; Schuler'
      },
      {
        area: 'Leerkracht',
        need: 'Heeft baat bij een leerkracht die aangepast gedrag en hoge cijfers niet automatisch gelijkstelt aan voldoende ontwikkeling.',
        advice:
          'Combineer hoge verwachtingen met cognitieve coaching en stuur bewust op leerdurf, eigen keuzes en werk buiten de comfortzone.',
        sources: 'Bakx e.a.; Hornstra e.a.'
      },
      {
        area: 'Groepsgenoten',
        need: 'Heeft vaak baat bij contact met ontwikkelingsgelijken, zodat uitdaging, herkenning en een minder bevestigingsgerichte leerhouding samen kunnen ontstaan.',
        advice:
          'Organiseer waar mogelijk structurele momenten van samenwerking of uitwisseling met leerlingen voor wie uitdaging normaal is.',
        sources: 'Hornstra, Van der Veen & Peetsma; Riley & White'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'Heeft baat bij volwassenen die zelfstandigheid en eigen keuzes stimuleren en spanning rond uitdaging niet direct wegnemen.',
        advice:
          'Stem met ouders af dat zij niet alles gladstrijken, maar de leerling laten oefenen met kiezen, volhouden en omgaan met ongemak.',
        sources: 'Schuler; Zerak e.a.'
      }
    ]
  },
  {
    id: 'type2',
    shortTitle: 'Type 2',
    title: 'Uitdagend creatief',
    description:
      'Deze leerling denkt vaak origineel, stelt kritische vragen en kan botsen met regels of verwachtingen wanneer de leeromgeving onvoldoende aansluit.',
    interpretation:
      'De leerling laat creativiteit en sterke ideeën zien, maar kan weerstand of ontregeling tonen wanneer er weinig ruimte is voor eigen denkwegen.',
    matrix1: {
      gevoelens:
        'Is vaak creatief, scherp en gevoelig voor onrecht of onlogica. Verveling, frustratie en wisselende zelfwaardering kunnen meespelen.',
      gedrag:
        'Stelt regels of werkwijzen ter discussie, corrigeert de leerkracht, reageert direct en kan impulsief of wisselend uit de hoek komen.',
      behoeften:
        'Heeft behoefte aan erkenning van creativiteit, ruimte voor eigen denkwegen, duidelijke afspraken en steun bij sociale afstemming.',
      signalen:
        'Wordt in de klas gemakkelijk gezien als lastig, opstandig of als disciplineprobleem, terwijl het creatieve potentieel minder snel wordt herkend.',
      begeleiding:
        'De begeleiding richt zich op een verschuiving van oppositie en ontregeling naar creativiteit met afstemming.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'Heeft baat bij instructie die doel en grens helder maakt, maar ruimte laat voor inhoudelijke tegenspraak of een alternatieve denkroute.',
        advice:
          'Formuleer eerst kort wat vaststaat, geef daarna ruimte voor een inhoudelijke vraag of andere aanpak en sluit af met heldere werkafspraken.',
        sources: 'Hornstra e.a.; Bakx e.a.'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'Heeft baat bij leerstof en opdrachten die betekenisvol, compact en uitdagend zijn en ruimte laten voor eigen vragen en meerdere denkwegen.',
        advice:
          'Kort de basis in wanneer die al beheerst wordt en bied daarna een betekenisvolle verdiepingsopdracht met duidelijke eisen, tijd en afronding.',
        sources: 'Gomez-Arizaga e.a.; Lee e.a.'
      },
      {
        area: 'Leeractiviteiten',
        need: 'Heeft baat bij leeractiviteiten waarin niet alleen het antwoord telt, maar ook ontwerpen, uitproberen, redeneren en verbeteren.',
        advice:
          'Kies geregeld voor open taken, probleemgestuurde opdrachten of ontwerpprocessen waarin de leerling mag onderzoeken, toelichten en bijstellen.',
        sources: 'Gomez-Arizaga e.a.; Sak; Lee e.a.'
      },
      {
        area: 'Feedback',
        need: 'Heeft baat bij feedback die eerst het denken erkent en daarna begrenst op vorm, toon of samenwerking.',
        advice:
          'Benoem eerst de gedachte, vondst of betrokkenheid en corrigeer daarna concreet op timing, gedrag of afstemming.',
        sources: 'Bakx e.a.; Lee e.a.'
      },
      {
        area: 'Leeromgeving',
        need: 'Heeft baat bij een leeromgeving waarin eigen en afwijkende ideeën ruimte krijgen zonder dat rust en voorspelbaarheid verdwijnen.',
        advice:
          'Maak routines en grenzen zichtbaar, geef ruimte aan nieuwe invalshoeken en grijp vroeg in wanneer effectgedrag de taak overneemt.',
        sources: 'Sak; Lee e.a.'
      },
      {
        area: 'Leerkracht',
        need: 'Heeft baat bij een leerkracht die kalm, duidelijk en relationeel stevig blijft en helpt om keuzes om te zetten in doelgericht handelen.',
        advice:
          'Ga niet mee in de provocatie, communiceer kort en helder, benoem het creatieve potentieel en coach de leerling op keuzes en gedrag.',
        sources: 'Bakx e.a.; Hornstra e.a.; Barbier e.a.'
      },
      {
        area: 'Groepsgenoten',
        need: 'Heeft baat bij contact met peers bij wie inhoudelijke aansluiting mogelijk is, met expliciete ondersteuning in sociale afstemming.',
        advice:
          'Zet de leerling niet willekeurig in groepjes, maar combineer bewust op taakniveau en maak rollen en afstemming expliciet.',
        sources: 'Van Rossen e.a.; Verschueren e.a.; Diezmann & Watters'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'Heeft baat bij volwassenen die sterke kanten erkennen, rustig reageren en grenzen duidelijk en consequent houden.',
        advice:
          'Stem met ouders een korte gezamenlijke lijn af voor omgaan met frustratie, directheid en discussiegedrag.',
        sources: 'Renati e.a.'
      }
    ]
  },
  {
    id: 'type3',
    shortTitle: 'Type 3',
    title: 'Onderduikend',
    description:
      'Deze leerling laat talenten minder zien om sociaal beter aan te sluiten bij de groep en probeert vooral niet op te vallen.',
    interpretation:
      'De leerling houdt talent of uitdaging eerder op de achtergrond om sociaal veilig te blijven en niet te veel zichtbaar te worden.',
    matrix1: {
      gevoelens:
        'Wil sociaal ergens bij horen en ervaart spanning tussen jezelf laten zien en geaccepteerd blijven.',
      gedrag:
        'Ontkent, relativeert of verbergt talent, wijst uitdaging af en trekt zich soms terug uit verrijkings- of plusaanbod.',
      behoeften:
        'Heeft behoefte aan keuzevrijheid zonder sociale druk, aan ondersteuning bij zelfbegrip en zelfacceptatie en aan contact met ontwikkelingsgelijken.',
      signalen:
        'Oogt in de klas vaak compliant, voorzichtig of gemiddeld, waardoor talent onzichtbaar kan blijven.',
      begeleiding:
        'De begeleiding richt zich op veilig zichtbaar worden en op uitdaging in een veilige, weinig opvallende vorm.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'Heeft baat bij instructie die uitdaging combineert met autonomie en sociale veiligheid, zonder steeds publieke zichtbaarheid te vragen.',
        advice:
          'Geef denktijd en keuze in responsvorm en voorkom dat kennis of inzicht steeds klassikaal en onverwacht getoond moet worden.',
        sources: 'Hornstra e.a.; Eddles-Hirsch e.a.'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'Heeft baat bij uitdagend aanbod dat blijft doorlopen zonder als opvallende uitzonderingspositie te worden georganiseerd.',
        advice:
          'Houd verrijking en verdieping vast en bied die waar nodig compact, parallel of kleinschalig aan.',
        sources: 'Betts & Neihart; Eddles-Hirsch e.a.; Kitsantas e.a.; Adams-Byers e.a.'
      },
      {
        area: 'Leeractiviteiten',
        need: 'Heeft baat bij leeractiviteiten waarin voorbereiding, keuze en gefaseerde zichtbaarheid mogelijk zijn.',
        advice:
          'Laat de leerling eerst individueel of in klein verband verkennen, oefenen of uitwerken voordat delen in de groep nodig is.',
        sources: 'Coleman e.a.; Eddles-Hirsch e.a.'
      },
      {
        area: 'Feedback',
        need: 'Heeft baat bij rustige, persoonlijke feedback die ontwikkeling bevestigt zonder extra sociale druk op te bouwen.',
        advice:
          'Geef feedback een-op-een en procesgericht en wees terughoudend met opvallende klassikale lof.',
        sources: 'Kitsantas e.a.; Hornstra e.a.'
      },
      {
        area: 'Leeromgeving',
        need: 'Heeft baat bij een leeromgeving waarin verschillen normaal zijn en presteren niet direct sociale kosten heeft.',
        advice:
          'Reageer op het wegzetten van prestatie, nieuwsgierigheid of anders-zijn en organiseer ondersteuning zo geïntegreerd mogelijk binnen het groepsklimaat.',
        sources: 'Coleman e.a.; Eddles-Hirsch e.a.'
      },
      {
        area: 'Leerkracht',
        need: 'Heeft baat bij een leerkracht die terugtrekgedrag leest als signaal, de relatie vasthoudt en uitdaging niet verwart met forceren.',
        advice:
          'Blijf in gesprek, benoem sociale spanning zonder te moraliseren en houd de verwachting op ontwikkeling vast zonder publiek vooruit te duwen.',
        sources: 'Bakx e.a.; Kitsantas e.a.; Hornstra e.a.'
      },
      {
        area: 'Groepsgenoten',
        need: 'Heeft baat bij contact met ontwikkelingsgelijken in een vorm die belonging versterkt zonder de uitzonderingspositie te vergroten.',
        advice:
          'Organiseer kleinschalige samenwerking, uitwisseling of pluscontact rond gedeelde interesses en denkniveau.',
        sources: 'Riley & White; Hornstra e.a.; Adams-Byers e.a.'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'Heeft baat bij volwassenen die talent erkennen zonder extra prestatiedruk op te bouwen en die sociale spanning serieus nemen.',
        advice:
          'Stem met ouders af hoe talent, sociale druk en eigen keuzes thuis en op school op een vergelijkbare manier worden begeleid.',
        sources: 'Olszewski-Kubilius e.a.; Noble e.a.'
      }
    ]
  },
  {
    id: 'type4',
    shortTitle: 'Type 4',
    title: 'Risicoleerling / ernstige onderprestatie',
    description:
      'Deze leerling is vaak afgehaakt van het onderwijsaanbod, ervaart frustratie en laat zijn of haar mogelijkheden in de klas nog maar beperkt zien.',
    interpretation:
      'De leerling laat signalen zien van afhaken, wantrouwen of strijd met school, waardoor betrokkenheid eerst moet worden hersteld.',
    matrix1: {
      gevoelens:
        'School voelt voor deze leerling vaak weinig betekenisvol of zelfs afwijzend. Boosheid, afkeer, somberheid en defensiviteit kunnen samen optreden.',
      gedrag:
        'Levert laag of wisselend werk, trekt zich terug of verstoort, reageert oppositioneel en richt energie liever op buitenschoolse interesses dan op schooltaken.',
      behoeften:
        'Heeft behoefte aan veiligheid, duidelijke begrenzing zonder machtsstrijd, een betekenisvolle relatie met een volwassene en korte haalbare doelen.',
      signalen:
        'Wordt op school gemakkelijk gezien als ongemotiveerd, opstandig of problematisch, terwijl talent of potentie naar de achtergrond verdwijnt.',
      begeleiding:
        'De begeleiding richt zich op herstel van betrokkenheid en vertrouwen, met een betekenisvoller en passender leertraject.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'Heeft baat bij instructie die kort blijft, snel naar de eerste stap toewerkt en daarna weer ruimte laat voor eigen handelen.',
        advice:
          'Geef een duidelijke eerste stap, controleer of de leerling weet hoe te beginnen en houd instructie functioneel en beperkt.',
        sources: 'Ronksley-Pavia & Neumann; Hornstra e.a.'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'Heeft baat bij opdrachten die opnieuw betekenis, uitdaging en relevantie krijgen en aansluiten bij interesse of een zichtbaar doel.',
        advice:
          'Vermijd lange reeksen standaardwerk en kies eerder voor onderzoek, casussen, projecten of producten die complexer en betekenisvoller zijn.',
        sources: 'Gomez-Arizaga e.a.; Baum e.a.; Emerick'
      },
      {
        area: 'Leeractiviteiten',
        need: 'Heeft baat bij leeractiviteiten waarin keuze, eigenaarschap, zelfregulatie en haalbare succeservaringen weer mogelijk worden.',
        advice:
          'Werk met kleine stappen, bied gerichte keuzeruimte en laat de leerling toewerken naar een concreet en zichtbaar resultaat.',
        sources: 'Ronksley-Pavia & Neumann; Baum e.a.'
      },
      {
        area: 'Feedback',
        need: 'Heeft baat bij feedback die begrenst zonder te vernederen, verantwoordelijkheid laat staan en vooral richting geeft aan de volgende stap.',
        advice:
          'Geef rustige, concrete feedback op wat al gelukt is, benoem de eerstvolgende haalbare stap en vermijd publieke correcties en machtsstrijd.',
        sources: 'Hebert & Olenchak; Betts & Neihart'
      },
      {
        area: 'Leeromgeving',
        need: 'Heeft baat bij een leeromgeving die veiligheid en voorspelbaarheid biedt en waarin zo nodig een andere route mogelijk is dan de gewone klassikale aanpak.',
        advice:
          'Verlaag sociale en prestatiedruk, voorkom onnodige confrontaties en organiseer waar nodig een alternatief of individueler arrangement.',
        sources: 'Betts & Neihart; Ronksley-Pavia'
      },
      {
        area: 'Leerkracht',
        need: 'Heeft baat bij een leerkracht die beschikbaar blijft, niet opgeeft en de relatie gebruikt als ingang voor herstel van betrokkenheid.',
        advice:
          'Blijf rustig, voorspelbaar en aanwezig, combineer begrenzing met vertrouwen en zet sterke kanten en interesses bewust in als ingang voor leren.',
        sources: 'Kesner; Hebert & Olenchak; Betts & Neihart'
      },
      {
        area: 'Groepsgenoten',
        need: 'Heeft baat bij zorgvuldig gekozen sociale situaties waarin negatieve labeling niet wordt versterkt en waarin contact met een positievere peergroep mogelijk is.',
        advice:
          'Kies samenwerking bewust, voorkom dat de leerling steeds in een probleemrol terechtkomt en benut waar mogelijk contacten rond gedeelde interesses.',
        sources: 'Baum e.a.; Riley & White'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'Heeft baat bij afstemming tussen school en thuis, zodat druk, teleurstelling en escalatie niet op twee plekken tegelijk worden versterkt.',
        advice:
          'Stem met ouders af welke kleine doelen centraal staan, houd de dialoog open en spreek gezamenlijk vertrouwen uit zonder verwachtingen te verlagen.',
        sources: 'Gilar-Corbi e.a.; Emerick; Betts & Neihart'
      }
    ]
  },
  {
    id: 'type5',
    shortTitle: 'Type 5',
    title: 'Dubbel bijzonder',
    description:
      'Deze leerling heeft kenmerken van begaafdheid en bijkomende leer- of ontwikkelingsproblemen, waardoor talent en ondersteuningsbehoeften elkaar kunnen maskeren.',
    interpretation:
      'De leerling laat sterke kanten en belemmeringen tegelijk zien, waardoor zowel uitdaging als compensatie nodig zijn.',
    matrix1: {
      gevoelens:
        'Ervaart vaak spanning tussen potentieel en uitvoerbaarheid. Frustratie, ontmoediging en een zwak academisch zelfbeeld kunnen samengaan met duidelijke sterke kanten.',
      gedrag:
        'Laat wisselende prestaties zien, werkt vaak inconsistent en kan chaotisch, traag of off-task overkomen, terwijl probleemoplossend denken of creativiteit opvalt.',
      behoeften:
        'Heeft behoefte aan onderwijs dat sterke kanten actief ontwikkelt en beperkingen tegelijk serieus neemt en compenseert.',
      signalen:
        'Wordt gemakkelijk onderschat, laat of eenzijdig herkend en vaak vooral bekeken vanuit tekort of gedrag.',
      begeleiding:
        'De begeleiding richt zich op twee lijnen: uitdagen in sterktegebieden en compenseren waar de uitvoering vastloopt.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'Heeft baat bij instructie die compact, helder en waar mogelijk multimodaal is en niet volledig leunt op precies het verwerkingskanaal waarin de grootste belemmering zit.',
        advice:
          'Geef kerninstructie, ondersteun met visuele of stapsgewijze cues en voorkom dat toegang tot de leerstof onnodig vastloopt op lezen, schrijven of auditieve verwerking.',
        sources: 'Baum, Cooper & Neu; Reis, Baum & Burke'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'Heeft baat bij leerstof en opdrachten die uitdagend blijven in sterktegebieden, terwijl zwakke uitvoeringskanalen waar nodig worden gecompenseerd.',
        advice:
          'Bied verdiepende of versnelde opdrachten aan waar de leerling sterk is en gebruik accommodaties of alternatieve input- en outputvormen wanneer de uitvoering blokkeert.',
        sources: 'Baum, Cooper & Neu; Reis, Baum & Burke'
      },
      {
        area: 'Leeractiviteiten',
        need: 'Heeft baat bij leeractiviteiten met keuze in werkwijze en uitingsvorm, expliciete strategie-instructie en ondersteuning bij plannen, organiseren en volhouden.',
        advice:
          'Werk met verschillende leerroutes, laat technologie of alternatieve verwerkingsvormen toe en oefen doelgericht met leerstrategieën en organisatie.',
        sources: 'Reis, Neu & McGuire; Willard-Holt, Weber & Morrison'
      },
      {
        area: 'Feedback',
        need: 'Heeft baat bij feedback die sterke kanten zichtbaar maakt en concreet aanwijst welke strategie of vervolgstap nodig is om verder te komen.',
        advice:
          'Benoem eerst wat inhoudelijk sterk is, geef daarna een gerichte vervolgstap of compensatiestrategie en voorkom dat feedback vooral draait om tekorten.',
        sources: 'Gierczyk & Hornby; Reis, Neu & McGuire'
      },
      {
        area: 'Leeromgeving',
        need: 'Heeft baat bij een ondersteunende en voorspelbare leeromgeving waarin aanpassingen genormaliseerd worden en talentontwikkeling even legitiem is als ondersteuning bij beperkingen.',
        advice:
          'Zorg voor rust, duidelijke verwachtingen en een veilig klimaat, normaliseer het gebruik van hulpmiddelen en maak zichtbaar dat verschillen ook sterktes kunnen betekenen.',
        sources: 'Gierczyk & Hornby; Willard-Holt, Weber & Morrison'
      },
      {
        area: 'Leerkracht',
        need: 'Heeft baat bij een leerkracht die breed kijkt, hoge verwachtingen vasthoudt en gedrag of wisselende prestaties niet automatisch leest als gebrek aan potentieel.',
        advice:
          'Onderzoek patronen van sterktes en discrepanties, combineer uitdaging met aanpassingen en stel steeds de vraag wat deze leerling nodig heeft om succesvol te zijn.',
        sources: 'McCallum e.a.; Gierczyk & Hornby; Reis, Neu & McGuire'
      },
      {
        area: 'Groepsgenoten',
        need: 'Heeft baat bij groepsvorming waarin sterke kanten gezien worden, rollen helder zijn en ontmoeting mogelijk is met cognitief of ervaringsmatig verwante peers.',
        advice:
          'Stel groepen bewust samen, verdeel rollen expliciet en organiseer waar mogelijk ook contact met leerlingen die vergelijkbare cognitieve uitdaging kennen.',
        sources: 'Gierczyk & Hornby; Willard-Holt, Weber & Morrison'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'Heeft baat bij afstemming tussen thuis en school over sterktes, belemmeringen, helpende aanpassingen en realistische doelen.',
        advice:
          'Stem met ouders af welke sterke kanten zichtbaar zijn, welke ondersteuning helpt en hoe samen gewerkt wordt aan zelfinzicht en haalbare succeservaringen.',
        sources: 'Reis, Neu & McGuire; Gierczyk & Hornby'
      }
    ]
  },
  {
    id: 'type6',
    shortTitle: 'Type 6',
    title: 'Zelfsturend autonoom',
    description:
      'Deze leerling kent zijn of haar mogelijkheden goed, werkt zelfstandig en zoekt actief passende uitdagingen.',
    interpretation:
      'De leerling is vaak al sterk zelfsturend en intrinsiek gemotiveerd, maar heeft blijvende uitdaging en afstemming nodig om groei open te houden.',
    matrix1: {
      gevoelens:
        'Heeft vaak een positief zelfbeeld, accepteert zichzelf en laat doorgaans een groeigerichte opvatting over leren zien.',
      gedrag:
        'Werkt zelfstandig, stelt doelen, zoekt uitdaging, zet door en gebruikt kansen in school actief voor verdere ontwikkeling.',
      behoeften:
        'Heeft gerichte ondersteuning nodig in de vorm van blijvende uitdaging, ruimte voor eigen doelen en feedback op vervolgstappen.',
      signalen:
        'Valt in de klas vaak positief op door zelfstandigheid, taakgerichtheid en verantwoordelijkheid, waardoor hij gezien kan worden als leerling die weinig begeleiding nodig heeft.',
      begeleiding:
        'De begeleiding richt zich op het openhouden van groei en het actief uitbouwen van ontwikkelkansen.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'Heeft baat bij instructie die kort en doelgericht is, met heldere criteria en ruimte om daarna zelfstandig en verdiepend verder te werken.',
        advice:
          'Beperk uitleg tot de kern, maak doel en kwaliteitscriteria expliciet en spreek af welke ruimte er is voor een eigen vervolgstap.',
        sources: 'Hornstra e.a.'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'Heeft baat bij leerstof en opdrachten die verdiepen, verbreden of versnellen en tegelijk aansluiten bij sterke interesses en langetermijndoelen.',
        advice:
          'Vermijd standaard extra werk en bied verdiepende, verbredende of versnellende opdrachten aan.',
        sources: 'Reis, Renzulli & Renzulli; Steenbergen-Hu & Moon'
      },
      {
        area: 'Leeractiviteiten',
        need: 'Heeft baat bij leeractiviteiten waarin niet alleen het eindproduct telt, maar ook doelkeuze, planning, aanpak, monitoring en evaluatie.',
        advice:
          'Laat de leerling doelen formuleren, keuzes toelichten, de eigen aanpak volgen en tussentijds verwoorden hoe hij bijstuurt of verder verdiept.',
        sources: 'Efklides; de Boer e.a.'
      },
      {
        area: 'Feedback',
        need: 'Heeft baat bij feedback die kwaliteit, strategiegebruik en verdere groei ondersteunt en niet alleen bevestigt dat het goed loopt.',
        advice:
          'Richt feedback op de gekozen aanpak, de kwaliteit van beslissingen, het bijsturen tijdens het werk en de volgende stap in de ontwikkeling.',
        sources: 'Efklides; Hornstra e.a.'
      },
      {
        area: 'Leeromgeving',
        need: 'Heeft baat bij een leeromgeving waarin zelfstandigheid samengaat met niveau, richting, passende materialen en bereikbare begeleiding.',
        advice:
          'Zorg dat verdiepen ook praktisch kan: geef ruimte in tempo en uitwerking, maar houd eisen hoog en blijf beschikbaar voor overleg en feedback.',
        sources: 'Hornstra e.a.; Reis, Renzulli & Renzulli'
      },
      {
        area: 'Leerkracht',
        need: 'Heeft baat bij een leerkracht die afstemt, uitdaagt en zelfstandigheid niet automatisch gelijkstelt aan voldoende ontwikkeling.',
        advice:
          'Combineer ruimte met hoge verwachtingen, onderzoek geregeld of het werk nog werkelijk uitdaagt en open actief nieuwe richtingen wanneer groei afvlakt.',
        sources: 'Bakx e.a.; Hornstra e.a.'
      },
      {
        area: 'Groepsgenoten',
        need: 'Heeft vaak baat bij contact met ontwikkelingsgelijken, zodat inhoudelijke uitwisseling, herkenning en cognitieve uitdaging samenkomen.',
        advice:
          'Organiseer waar mogelijk structurele momenten van samenwerking, uitwisseling of onderwijs met leerlingen die vergelijkbare cognitieve uitdaging hebben.',
        sources: 'Vogl & Preckel'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'Heeft baat bij volwassenen die ruimte geven aan interesses en zelfstandigheid en tegelijk kansen organiseren en verdere ontwikkeling actief ondersteunen.',
        advice:
          'Stem met ouders af hoe interesses, doelen en ontwikkelkansen thuis en op school op elkaar kunnen aansluiten, zonder dat zelfstandigheid gelijk wordt aan loslaten.',
        sources: 'Efklides; Luo & Kiewra'
      }
    ]
  }
];

export default profiles;
