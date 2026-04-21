const profiles = [
  {
    id: 'type1',
    shortTitle: 'Type 1',
    title: 'Aangepast succesvol',
    description:
      'Deze leerling past zich goed aan het schoolsysteem aan, werkt vaak netjes en valt daardoor niet snel op als leerling met specifieke onderwijsbehoeften.',
    interpretation:
      'De leerling functioneert zichtbaar goed, maar laat vaak minder groei zien dan mogelijk is, omdat hij of zij veilig blijft werken en weinig risico neemt.',
    matrix1: {
      gevoelens:
        'Wil het graag goed doen, is gevoelig voor verwachtingen van anderen en kan perfectionistisch, foutgevoelig en bevestigingsgericht reageren.',
      gedrag:
        'Werkt netjes, volgt instructies, levert verzorgd werk in en laat weinig storend gedrag zien, maar kiest vaak voor de veilige weg.',
      behoeften:
        'Heeft behoefte aan echte uitdaging, ruimte voor eigen keuzes, groei in zelfstandige leerstrategieën, creativiteit en een minder vaste kijk op slim zijn.',
      signalen:
        'Valt in de klas vaak positief op door goede resultaten en taakgericht gedrag, waardoor verveling of risicomijding minder snel wordt herkend.',
      begeleiding:
        'De begeleiding richt zich op de stap van aangepast succes naar zelfstandiger leren, meer denkdurf en werken buiten de comfortzone.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'De leerling heeft baat bij instructie die snel laat zien wat al beheerst wordt en daarna ruimte geeft om zelfstandig verder te werken.',
        advice:
          'Check vooraf kort wat de leerling al beheerst en voorkom onnodig lange of herhaalde instructie als de basis al duidelijk is.',
        sources: 'Reis & Renzulli (2005)'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'De leerling heeft opdrachten nodig die verder gaan dan herhaling en reproductie en die vragen om denkdiepte, eigen keuzes en werken buiten de veilige standaardroute.',
        advice:
          'Compact leerstof die de leerling al beheerst en bied daarna opdrachten aan waarin gekozen, onderbouwd en echt nagedacht moet worden.',
        sources: 'Reis & Renzulli (2005); Reis et al. (2021)'
      },
      {
        area: 'Leeractiviteiten',
        need: 'De leerling heeft baat bij leeractiviteiten waarin niet alleen het goede antwoord telt, maar ook aanpak, planning, monitoring en redenering.',
        advice:
          'Laat de leerling verwoorden hoe iets is aangepakt, waar echt nagedacht moest worden en welke keuzes zijn gemaakt.',
        sources: 'Efklides (2018); Reis et al. (2021)'
      },
      {
        area: 'Feedback',
        need: 'De leerling heeft feedback nodig die minder draait om bevestiging en meer om inspanning, strategiegebruik en volgende groeistappen.',
        advice:
          'Richt feedback op de gekozen aanpak, benoem waar het werk nog veilig bleef en maak duidelijk welke volgende stap meer zelfstandigheid vraagt.',
        sources: 'Efklides (2018); Hornstra et al. (2020); Makel et al. (2020)'
      },
      {
        area: 'Leeromgeving',
        need: 'De leerling heeft een leeromgeving nodig waarin uitdaging normaal is en fouten niet meteen voelen als mislukken.',
        advice:
          'Maak duidelijk dat lastig werk, proberen en herzien bij leren horen en niet hetzelfde zijn als falen.',
        sources: 'Dixon et al. (2004); Grugan et al. (2021); Schuler (2000)'
      },
      {
        area: 'Leerkracht',
        need: 'De leerling heeft een leerkracht nodig die aangepast gedrag en hoge cijfers niet automatisch ziet als voldoende ontwikkeling.',
        advice:
          'Combineer hoge verwachtingen met gerichte begeleiding bij denken, kiezen en doorzetten, en stuur bewust op meer denkdurf en werk buiten de comfortzone.',
        sources: 'Bakx et al. (2017); Hornstra et al. (2020)'
      },
      {
        area: 'Groepsgenoten',
        need: 'De leerling heeft vaak baat bij contact met leerlingen voor wie uitdaging normaal is, zodat herkenning en een minder bevestigingsgerichte leerhouding kunnen groeien.',
        advice:
          'Organiseer waar mogelijk vaste momenten van samenwerking of uitwisseling met leerlingen die ook behoefte hebben aan uitdaging.',
        sources: 'Hornstra et al. (2017); Riley & White (2016)'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'De leerling heeft baat bij volwassenen die zelfstandigheid en eigen keuzes stimuleren en spanning rond uitdaging niet meteen wegnemen.',
        advice:
          'Stem met ouders af dat zij niet alles gladstrijken, maar de leerling laten oefenen met kiezen, volhouden en omgaan met ongemak.',
        sources: 'Schuler (2000); Žerak et al. (2024)'
      }
    ]
  },
  {
    id: 'type2',
    shortTitle: 'Type 2',
    title: 'Uitdagend creatief',
    description:
      'Deze leerling denkt vaak origineel, stelt kritische vragen en botst sneller met regels of verwachtingen als het aanbod niet goed aansluit.',
    interpretation:
      'De leerling laat creativiteit en sterke ideeën zien, maar kan weerstand of onrust laten zien als er te weinig ruimte is voor eigen denkwegen.',
    matrix1: {
      gevoelens:
        'Is vaak creatief, scherp en gevoelig voor onrecht of onlogica. Verveling, frustratie en wisselende zelfwaardering kunnen meespelen.',
      gedrag:
        'Stelt regels of werkwijzen ter discussie, corrigeert de leerkracht, reageert direct en kan impulsief of wisselend uit de hoek komen.',
      behoeften:
        'Heeft behoefte aan erkenning van creativiteit, ruimte voor eigen denkwegen, duidelijke afspraken en steun bij sociale afstemming.',
      signalen:
        'Wordt in de klas gemakkelijk gezien als lastig of opstandig, terwijl het creatieve potentieel minder snel wordt herkend.',
      begeleiding:
        'De begeleiding richt zich op de stap van oppositie en onrust naar creativiteit met afstemming.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'De leerling heeft baat bij instructie die duidelijk maakt wat vaststaat, maar ook ruimte laat voor een inhoudelijke vraag of een andere denkroute.',
        advice:
          'Formuleer eerst kort wat het doel is en wat vastligt. Geef daarna ruimte voor een inhoudelijke vraag of een andere aanpak en sluit af met duidelijke werkafspraken.',
        sources: 'Hornstra et al. (2020); Bakx et al. (2017)'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'De leerling heeft leerstof en opdrachten nodig die betekenisvol, compact en uitdagend zijn en ruimte laten voor eigen vragen en meerdere denkwegen.',
        advice:
          'Kort de basis in als die al beheerst wordt en bied daarna een verdiepingsopdracht aan met duidelijke eisen, tijd en afronding.',
        sources: 'Gómez-Arízaga et al. (2020); Lee et al. (2021)'
      },
      {
        area: 'Leeractiviteiten',
        need: 'De leerling heeft baat bij leeractiviteiten waarin niet alleen het antwoord telt, maar ook ontwerpen, uitproberen, redeneren en verbeteren.',
        advice:
          'Kies geregeld voor open taken, probleemgestuurde opdrachten of ontwerpprocessen waarin de leerling kan onderzoeken, toelichten en bijstellen.',
        sources: 'Gómez-Arízaga et al. (2020); Sak (2004); Lee et al. (2021)'
      },
      {
        area: 'Feedback',
        need: 'De leerling heeft feedback nodig die eerst het denken erkent en daarna duidelijk begrenst op vorm, toon of samenwerking.',
        advice:
          'Benoem eerst de gedachte, vondst of betrokkenheid en stuur daarna concreet bij op timing, gedrag of afstemming.',
        sources: 'Bakx et al. (2017); Lee et al. (2021)'
      },
      {
        area: 'Leeromgeving',
        need: 'De leerling heeft een leeromgeving nodig waarin eigen en afwijkende ideeën ruimte krijgen zonder dat rust en voorspelbaarheid verdwijnen.',
        advice:
          'Maak routines en grenzen duidelijk, geef ruimte aan nieuwe invalshoeken en grijp op tijd in als effectgedrag de taak overneemt.',
        sources: 'Sak (2004); Lee et al. (2021)'
      },
      {
        area: 'Leerkracht',
        need: 'De leerling heeft een leerkracht nodig die rustig, duidelijk en stevig blijft en helpt om ideeën om te zetten in doelgericht handelen.',
        advice:
          'Ga niet mee in provocatie, communiceer kort en helder, benoem het creatieve potentieel en coach de leerling op keuzes en gedrag.',
        sources: 'Bakx et al. (2017); Hornstra et al. (2020); Barbier et al. (2022)'
      },
      {
        area: 'Groepsgenoten',
        need: 'De leerling heeft baat bij contact met peers bij wie inhoudelijke aansluiting mogelijk is, met duidelijke steun bij samenwerken.',
        advice:
          'Zet de leerling niet willekeurig in groepjes, maar combineer bewust op taakniveau en maak rollen en samenwerking expliciet.',
        sources: 'van Rossen et al. (2021); Verschueren et al. (2019); Diezmann & Watters (2001)'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'De leerling heeft baat bij volwassenen die sterke kanten erkennen, rustig reageren en grenzen duidelijk en consequent houden.',
        advice:
          'Stem met ouders een korte gezamenlijke lijn af voor omgaan met frustratie, directheid en discussiegedrag.',
        sources: 'Renati et al. (2022)'
      }
    ]
  },
  {
    id: 'type3',
    shortTitle: 'Type 3',
    title: 'Onderduikend',
    description:
      'Deze leerling laat vaak minder zien dan hij of zij kan, omdat opvallen in de groep spanning oproept.',
    interpretation:
      'De leerling houdt talent en uitdaging eerder op de achtergrond om sociaal veilig te blijven en niet te veel op te vallen.',
    matrix1: {
      gevoelens:
        'De leerling wil erbij horen en kan spanning voelen tussen laten zien wat hij of zij kan en geaccepteerd blijven in de groep.',
      gedrag:
        'De leerling houdt goede ideeën geregeld voor zich, wijst uitdaging af of trekt zich terug zodra hij of zij zichtbaar afwijkt van de groep.',
      behoeften:
        'De leerling heeft uitdaging nodig, maar wel op een manier die veilig voelt en niet onnodig veel aandacht trekt.',
      signalen:
        'De leerling oogt in de klas vaak rustig, voorzichtig of gemiddeld, terwijl er in een klein groepje of in een rustig gesprek meer zichtbaar wordt.',
      begeleiding:
        'De begeleiding richt zich op veilig zichtbaar worden en op uitdaging in een vorm die weinig druk geeft.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'De leerling heeft baat bij instructie die uitdaging combineert met autonomie en sociale veiligheid.',
        advice:
          'Geef denktijd en laat de leerling waar mogelijk kiezen hoe hij of zij reageert: mondeling, schriftelijk, individueel of eerst met een maatje. Voorkom dat kennis of inzicht steeds onverwacht en klassikaal getoond moet worden.',
        sources: 'Hornstra et al. (2020); Eddles-Hirsch et al. (2012)'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'De leerling heeft uitdagend werk nodig dat blijft doorlopen, zonder dat het voelt als een opvallende uitzonderingspositie.',
        advice:
          'Houd verrijking en verdieping vast. Bied die compact, parallel of kleinschalig aan. Doe dat waar mogelijk samen met één of meer passende peers, zodat uitdaging minder voelt als apart gezet worden.',
        sources: 'Betts & Neihart (1988; 2010); Eddles-Hirsch et al. (2012); Kitsantas et al. (2017); Adams-Byers et al. (2004)'
      },
      {
        area: 'Leeractiviteiten',
        need: 'De leerling heeft baat bij werkvormen waarin voorbereiding, keuze en gefaseerde zichtbaarheid mogelijk zijn.',
        advice:
          'Laat de leerling eerst individueel of in klein verband verkennen, oefenen of uitwerken voordat delen in de groep nodig is. Bouw zichtbaarheid stap voor stap op.',
        sources: 'Coleman et al. (2015); Eddles-Hirsch et al. (2012)'
      },
      {
        area: 'Feedback',
        need: 'De leerling heeft behoefte aan rustige, persoonlijke feedback die ontwikkeling bevestigt zonder extra sociale druk te geven.',
        advice:
          'Geef feedback één-op-één en richt die op groei en aanpak. Wees terughoudend met opvallende klassikale complimenten als die de leerling juist kleiner maken.',
        sources: 'Kitsantas et al. (2017); Hornstra et al. (2020)'
      },
      {
        area: 'Leeromgeving',
        need: 'De leerling heeft een leeromgeving nodig waarin verschillen normaal zijn en goed presteren niet meteen betekent dat je buiten de groep valt.',
        advice:
          'Reageer op het wegzetten van prestatie, nieuwsgierigheid of anders-zijn. Organiseer ondersteuning zo veel mogelijk binnen het gewone groepsklimaat, zodat de leerling niet onnodig als uitzondering wordt neergezet.',
        sources: 'Coleman et al. (2015); Eddles-Hirsch et al. (2012)'
      },
      {
        area: 'Leerkracht',
        need: 'De leerling heeft een leerkracht nodig die terughoudend gedrag herkent, het contact met de leerling bewaart en uitdaging aanbiedt zonder druk op te voeren.',
        advice:
          'Blijf in gesprek, benoem wat je ziet zonder te duwen en bied uitdaging aan in kleine, haalbare stappen.',
        sources: 'Bakx et al. (2017); Kitsantas et al. (2017); Hornstra et al. (2020)'
      },
      {
        area: 'Groepsgenoten',
        need: 'De leerling heeft baat bij contact met leerlingen die qua denken, niveau of interesse beter aansluiten, in een vorm die het gevoel van erbij horen versterkt.',
        advice:
          'Organiseer kleinschalige samenwerking, uitwisseling of pluscontact rond gedeelde interesses en denkniveau, zonder daar een grote uitzondering van te maken.',
        sources: 'Riley & White (2016); Hornstra et al. (2020); Adams-Byers et al. (2004)'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'De leerling heeft baat bij volwassenen die talent erkennen zonder extra prestatiedruk op te bouwen en die sociale spanning serieus nemen.',
        advice:
          'Stem met ouders af hoe talent, sociale druk en eigen keuzes thuis en op school op een vergelijkbare manier worden begeleid. Gebruik informatie van thuis ook om beter te begrijpen wat de leerling laat zien als de druk lager is.',
        sources: 'Papadopoulos (2021); Noble et al. (1999)'
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
        'Heeft behoefte aan veiligheid, duidelijke grenzen zonder machtsstrijd, een betekenisvolle relatie met een volwassene en korte haalbare doelen.',
      signalen:
        'Wordt op school gemakkelijk gezien als ongemotiveerd, opstandig of problematisch, terwijl talent of potentie naar de achtergrond verdwijnt.',
      begeleiding:
        'De begeleiding richt zich op herstel van betrokkenheid en vertrouwen, met een betekenisvoller en passender leertraject.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'De leerling heeft baat bij instructie die kort blijft, snel naar de eerste stap toewerkt en daarna weer ruimte laat voor eigen handelen.',
        advice:
          'Geef een duidelijke eerste stap, controleer of de leerling weet hoe te beginnen en houd instructie functioneel en beperkt.',
        sources: 'Ronksley-Pavia & Neumann (2022); Hornstra et al. (2020)'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'De leerling heeft opdrachten nodig die weer betekenis, uitdaging en relevantie krijgen en aansluiten bij interesse of een zichtbaar doel.',
        advice:
          'Vermijd lange reeksen standaardwerk en kies eerder voor onderzoek, casussen, projecten of producten die complexer en betekenisvoller zijn.',
        sources: 'Gómez-Arízaga et al. (2020); Baum et al. (1995); Emerick (1992)'
      },
      {
        area: 'Leeractiviteiten',
        need: 'De leerling heeft baat bij leeractiviteiten waarin keuze, eigenaarschap, zelfregulatie en haalbare succeservaringen weer mogelijk worden.',
        advice:
          'Werk met kleine stappen, bied gerichte keuzeruimte en laat de leerling toewerken naar een concreet en zichtbaar resultaat.',
        sources: 'Ronksley-Pavia & Neumann (2022); Baum et al. (1995)'
      },
      {
        area: 'Feedback',
        need: 'De leerling heeft baat bij feedback die begrenst zonder te vernederen, verantwoordelijkheid laat staan en vooral richting geeft aan de volgende stap.',
        advice:
          'Geef rustige, concrete feedback op wat al gelukt is, benoem de eerstvolgende haalbare stap en vermijd publieke correcties en machtsstrijd.',
        sources: 'Hébert & Olenchak (2000); Betts & Neihart (1988; 2010)'
      },
      {
        area: 'Leeromgeving',
        need: 'De leerling heeft een leeromgeving nodig die veiligheid en voorspelbaarheid biedt en waarin zo nodig een andere route mogelijk is dan de gewone klassikale aanpak.',
        advice:
          'Verlaag sociale en prestatiedruk, voorkom onnodige confrontaties en organiseer waar nodig een alternatief of individueler arrangement.',
        sources: 'Betts & Neihart (1988; 2010); Ronksley-Pavia (2020)'
      },
      {
        area: 'Leerkracht',
        need: 'De leerling heeft baat bij een leerkracht die beschikbaar blijft, niet afhaakt en de relatie gebruikt als ingang voor herstel van betrokkenheid.',
        advice:
          'Blijf rustig, voorspelbaar en aanwezig, combineer begrenzing met vertrouwen en zet sterke kanten en interesses bewust in als ingang voor leren.',
        sources: 'Kesner (2005); Hébert & Olenchak (2000); Betts & Neihart (1988; 2010)'
      },
      {
        area: 'Groepsgenoten',
        need: 'De leerling heeft baat bij zorgvuldig gekozen sociale situaties waarin een negatieve rol niet verder wordt versterkt en waarin contact met beter passende peers mogelijk is.',
        advice:
          'Kies samenwerking bewust, voorkom dat de leerling steeds in een probleemrol terechtkomt en benut waar mogelijk contacten rond gedeelde interesses.',
        sources: 'Baum et al. (1995); Riley & White (2016)'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'De leerling heeft baat bij afstemming tussen school en thuis, zodat druk, teleurstelling en escalatie niet op twee plekken tegelijk oplopen.',
        advice:
          'Stem met ouders af welke kleine doelen centraal staan, houd de dialoog open en spreek gezamenlijk vertrouwen uit zonder verwachtingen te verlagen.',
        sources: 'Gilar-Corbi et al. (2019); Emerick (1992); Betts & Neihart (1988; 2010)'
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
        'Laat wisselende prestaties zien, werkt vaak inconsistent en kan chaotisch, traag of afgeleid overkomen, terwijl probleemoplossend denken of creativiteit opvalt.',
      behoeften:
        'Heeft behoefte aan onderwijs dat sterke kanten actief ontwikkelt en beperkingen tegelijk serieus neemt en compenseert.',
      signalen:
        'Wordt gemakkelijk onderschat, laat of eenzijdig herkend en vaak vooral bekeken vanuit tekort of gedrag.',
      begeleiding:
        'De begeleiding richt zich op twee lijnen: uitdagen in sterke gebieden en compenseren waar de uitvoering vastloopt.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'De leerling heeft baat bij instructie die compact, helder en waar mogelijk via meerdere ingangen wordt aangeboden, zodat de leerstof niet vastloopt op één zwak verwerkingskanaal.',
        advice:
          'Geef kerninstructie, ondersteun met visuele of stapsgewijze hulp en voorkom dat toegang tot de leerstof onnodig vastloopt op lezen, schrijven of auditieve verwerking.',
        sources: 'Baum, Cooper & Neu (2001); Reis, Baum & Burke (2014)'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'De leerling heeft leerstof en opdrachten nodig die uitdagend blijven in sterke gebieden, terwijl zwakke uitvoeringskanalen waar nodig worden gecompenseerd.',
        advice:
          'Bied verdiepende of versnelde opdrachten aan waar de leerling sterk in is en gebruik aanpassingen of andere input- en outputvormen wanneer de uitvoering vastloopt.',
        sources: 'Baum, Cooper & Neu (2001); Reis, Baum & Burke (2014)'
      },
      {
        area: 'Leeractiviteiten',
        need: 'De leerling heeft baat bij leeractiviteiten met keuze in werkwijze en uitingsvorm, expliciete strategie-instructie en steun bij plannen, organiseren en volhouden.',
        advice:
          'Werk met verschillende leerroutes, laat technologie of andere verwerkingsvormen toe en oefen doelgericht met leerstrategieën en organisatie.',
        sources: 'Reis, Neu & McGuire (1995); Willard-Holt et al. (2013)'
      },
      {
        area: 'Feedback',
        need: 'De leerling heeft baat bij feedback die sterke kanten zichtbaar maakt en concreet aanwijst welke strategie of vervolgstap nodig is om verder te komen.',
        advice:
          'Benoem eerst wat inhoudelijk sterk is, geef daarna een gerichte vervolgstap of compensatiestrategie en voorkom dat feedback vooral draait om tekorten.',
        sources: 'Gierczyk & Hornby (2021); Reis, Neu & McGuire (1995)'
      },
      {
        area: 'Leeromgeving',
        need: 'De leerling heeft een ondersteunende en voorspelbare leeromgeving nodig waarin aanpassingen normaal zijn en talentontwikkeling even serieus wordt genomen als ondersteuning bij belemmeringen.',
        advice:
          'Zorg voor rust, duidelijke verwachtingen en een veilig klimaat, normaliseer het gebruik van hulpmiddelen en maak zichtbaar dat verschillen ook sterke kanten kunnen betekenen.',
        sources: 'Gierczyk & Hornby (2021); Willard-Holt et al. (2013)'
      },
      {
        area: 'Leerkracht',
        need: 'De leerling heeft een leerkracht nodig die breed kijkt, hoge verwachtingen vasthoudt en wisselende prestaties niet automatisch ziet als gebrek aan potentieel.',
        advice:
          'Onderzoek patronen van sterktes en verschillen, combineer uitdaging met aanpassingen en stel steeds de vraag wat deze leerling nodig heeft om succesvol te zijn.',
        sources: 'McCallum et al. (2013); Gierczyk & Hornby (2021); Reis, Neu & McGuire (1995)'
      },
      {
        area: 'Groepsgenoten',
        need: 'De leerling heeft baat bij groepsvorming waarin sterke kanten gezien worden, rollen helder zijn en contact mogelijk is met cognitief of ervaringsmatig passende peers.',
        advice:
          'Stel groepen bewust samen, verdeel rollen expliciet en organiseer waar mogelijk ook contact met leerlingen die vergelijkbare cognitieve uitdaging kennen.',
        sources: 'Gierczyk & Hornby (2021); Willard-Holt et al. (2013)'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'De leerling heeft baat bij afstemming tussen thuis en school over sterke kanten, belemmeringen, helpende aanpassingen en haalbare doelen.',
        advice:
          'Stem met ouders af welke sterke kanten zichtbaar zijn, welke ondersteuning helpt en hoe samen gewerkt wordt aan zelfinzicht en haalbare succeservaringen.',
        sources: 'Reis, Neu & McGuire (1995); Gierczyk & Hornby (2021)'
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
      'De leerling is vaak al sterk zelfsturend en intrinsiek gemotiveerd, maar heeft blijvende uitdaging en afstemming nodig om in ontwikkeling te blijven.',
    matrix1: {
      gevoelens:
        'Heeft vaak een positief zelfbeeld, accepteert zichzelf en laat doorgaans een groeigerichte kijk op leren zien.',
      gedrag:
        'Werkt zelfstandig, stelt doelen, zoekt uitdaging, zet door en gebruikt kansen in school actief voor verdere ontwikkeling.',
      behoeften:
        'Heeft blijvende uitdaging nodig, ruimte voor eigen doelen en feedback op vervolgstappen.',
      signalen:
        'Valt in de klas vaak positief op door zelfstandigheid, taakgerichtheid en verantwoordelijkheid, waardoor makkelijk wordt gedacht dat er weinig begeleiding nodig is.',
      begeleiding:
        'De begeleiding richt zich op het openhouden van groei en het actief uitbouwen van ontwikkelkansen.'
    },
    needs: [
      {
        area: 'Instructie',
        need: 'De leerling heeft baat bij instructie die kort en doelgericht is, met heldere criteria en ruimte om daarna zelfstandig en verdiepend verder te werken.',
        advice:
          'Beperk uitleg tot de kern, maak doel en kwaliteitscriteria duidelijk en spreek af welke ruimte er is voor een eigen vervolgstap.',
        sources: 'Hornstra et al. (2020)'
      },
      {
        area: 'Leerstof en opdrachten',
        need: 'De leerling heeft leerstof en opdrachten nodig die verdiepen, verbreden of versnellen en tegelijk aansluiten bij sterke interesses en langere doelen.',
        advice:
          'Vermijd standaard extra werk en bied verdiepende, verbredende of versnellende opdrachten aan.',
        sources: 'Reis et al. (2021); Steenbergen-Hu & Moon (2011)'
      },
      {
        area: 'Leeractiviteiten',
        need: 'De leerling heeft baat bij leeractiviteiten waarin niet alleen het eindproduct telt, maar ook doelkeuze, planning, aanpak, monitoring en evaluatie.',
        advice:
          'Laat de leerling doelen formuleren, keuzes toelichten, de eigen aanpak volgen en tussentijds verwoorden hoe hij of zij bijstuurt of verder verdiept.',
        sources: 'Efklides (2018); de Boer et al. (2013)'
      },
      {
        area: 'Feedback',
        need: 'De leerling heeft feedback nodig die kwaliteit, strategiegebruik en verdere groei ondersteunt en niet alleen bevestigt dat het goed loopt.',
        advice:
          'Richt feedback op de gekozen aanpak, de kwaliteit van beslissingen, het bijsturen tijdens het werk en de volgende stap in de ontwikkeling.',
        sources: 'Efklides (2018); Hornstra et al. (2020)'
      },
      {
        area: 'Leeromgeving',
        need: 'De leerling heeft een leeromgeving nodig waarin zelfstandigheid samengaat met niveau, richting, passende materialen en bereikbare begeleiding.',
        advice:
          'Zorg dat verdiepen ook praktisch kan: geef ruimte in tempo en uitwerking, maar houd eisen hoog en blijf beschikbaar voor overleg en feedback.',
        sources: 'Hornstra et al. (2020); Reis et al. (2021)'
      },
      {
        area: 'Leerkracht',
        need: 'De leerling heeft baat bij een leerkracht die afstemt, uitdaagt en zelfstandigheid niet verwart met voldoende ontwikkeling.',
        advice:
          'Combineer ruimte met hoge verwachtingen, onderzoek geregeld of het werk nog echt uitdaagt en open actief nieuwe richtingen wanneer groei afvlakt.',
        sources: 'Bakx et al. (2017); Hornstra et al. (2020)'
      },
      {
        area: 'Groepsgenoten',
        need: 'De leerling heeft vaak baat bij contact met leerlingen die op een vergelijkbaar niveau denken, zodat uitwisseling, herkenning en uitdaging samenkomen.',
        advice:
          'Organiseer waar mogelijk vaste momenten van samenwerking, uitwisseling of onderwijs met leerlingen die vergelijkbare cognitieve uitdaging hebben.',
        sources: 'Vogl & Preckel (2014)'
      },
      {
        area: 'Thuissituatie / ouders',
        need: 'De leerling heeft baat bij volwassenen die ruimte geven aan interesses en zelfstandigheid en tegelijk ontwikkelkansen actief blijven ondersteunen.',
        advice:
          'Stem met ouders af hoe interesses, doelen en ontwikkelkansen thuis en op school op elkaar kunnen aansluiten, zonder dat zelfstandigheid hetzelfde wordt als loslaten.',
        sources: 'Efklides (2018); Luo & Kiewra (2020)'
      }
    ]
  }
];

export default profiles;