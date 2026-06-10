export interface TimelineEventDetail {
  id: string;
  year: string;
  accentColor: string;
  title: { ua: string; en: string };
  description: { ua: string; en: string };
  images: string[];
  contentUA: string;
  contentEN: string;
}

export const TIMELINE_EVENT_DETAILS: TimelineEventDetail[] = [
  {
    id: "kyivan-rus-882",
    year: "882",
    accentColor: "#ffd700",
    title: {
      ua: "Заснування Київської Русі",
      en: "Foundation of Kyivan Rus",
    },
    description: {
      ua: "Князь Олег об'єднує слов'янські племена та оголошує Київ столицею",
      en: "Prince Oleg unites East Slavic tribes and establishes Kyiv as the capital",
    },
    images: [],
    contentUA: `<h3>Засновники та серце держави: Київські землі</h3>
<p>Легенда шепоче імена <strong>Кия, Щека, Хорива</strong> та їхньої сестри <strong>Либеді</strong> — саме вони заклали перші камені на київських пагорбах. Але справжня велика гра почалася у <strong>882 році</strong>, коли варязький князь <strong>Олег</strong> об'єднав слов'янські племена залізною рукою, проголосивши Київ <strong>«матір'ю градам руським»</strong>.</p>

<h3>Чернігівщина: Лісові гіганти, містика та вічна зброя</h3>
<p>Якщо Київ був інтелектуальним та релігійним серцем, то <strong>Чернігів</strong> — це суворий, містичний і неймовірно багатий лісовий гігант. Чернігівщина — це край безкраїх лісів, де ще довго після хрещення Русі трималися язичницькі традиції.</p>
<p>Чернігівці були неперевершеними <strong>мисливцями на хутрового звіра</strong> та <strong>бортниками</strong> — добували дикий мед. Чернігівські ковалі кували найкращі бойові сокири та масивні мечі.</p>

<h3>Галичина: Сіль, європейський шик та гонорові бояри</h3>
<p><strong>Галицьке князівство</strong> — західні ворота держави. Життя будувалося на <strong>«білому золоті»</strong> середньовіччя — солі. Галицькі <strong>бояри</strong> мали таку силу, що могли вигнати самого князя. Галицькі князі одними з перших почали використовувати <strong>важкоозброєну рицарську кінноту</strong>.</p>

<h3>Побут, їжа та розваги русичів</h3>
<p>Прості люди жили в <strong>напівземлянках</strong> з глинобитними печами. На столі — <strong>густі зернові каші, варена ріпа</strong>, <strong>житній хліб</strong>. Пили квас, вівсяний кисіль або ситу. Розвагами були виступи <strong>скоморохів</strong> — бродячих музикантів і акторів.</p>`,
    contentEN: `<h3>The Founders and the Heart of the State: Kyivan Lands</h3>
<p>Legend whispers the names of <strong>Ky, Shchek, Khoriv</strong> and their sister <strong>Lybid</strong> — they laid the first stones on the Kyivan hills. The real game began in <strong>882</strong>, when Varangian prince <strong>Oleg</strong> united the Slavic tribes, proclaiming Kyiv <strong>"the mother of Rus cities"</strong>.</p>

<h3>Chernihiv: Forest Giants, Mysticism and Eternal Weapons</h3>
<p>If Kyiv was the intellectual and religious heart, <strong>Chernihiv</strong> was a stern, mystical, and incredibly wealthy forest giant. Chernihiv region is a land of endless forests where pagan traditions persisted long after the baptism of Rus.</p>

<h3>Halychyna: Salt, European Style and Proud Boyars</h3>
<p><strong>Galician Principality</strong> — the western gates of the state. Life was built on <strong>"white gold"</strong> of the Middle Ages — salt. Galician <strong>boyars</strong> were so powerful they could expel the prince himself. Galician princes were among the first to use <strong>heavily armed knightly cavalry</strong>.</p>

<h3>Daily Life, Food and Entertainment of the Rus</h3>
<p>Common people lived in <strong>semi-dugouts</strong> with clay ovens. The table featured <strong>thick grain porridge, boiled turnips</strong>, and <strong>rye bread</strong>. Entertainment came from <strong>skomorokhs</strong> — wandering musicians and actors.</p>`,
  },
  {
    id: "st-sophia-construction",
    year: "1017-1037",
    accentColor: "#ffd700",
    title: {
      ua: "Задум та будівництво Собору Святої Софії",
      en: "Conception and Construction of St. Sophia Cathedral",
    },
    description: {
      ua: "Закладений князем Ярославом Мудрим на честь перемоги над печенігами. Будувався 20 років як головний храм Київської Русі.",
      en: "Founded by Prince Yaroslav the Wise to celebrate victory over the Pechenegs. Built over 20 years as the main church of Kyivan Rus.",
    },
    images: [],
    contentUA: `<h3>Хто захотів її побудувати?</h3>
<p>Собор Святої Софії заклав <strong>великий київський князь Ярослав Мудрий</strong> (1019–1054). Він присвятив храм Софії — Божественній Премудрості, щоб відзначити перемогу над кочівниками-печенігами та утвердити Київську Русь як могутню християнську державу, рівну Візантії.</p>

<h3>Як довго її будували?</h3>
<p>Основне будівництво тривало приблизно <strong>20 років</strong> (з 1017 по 1037 рік). Це був велетенський проєкт з <strong>13 бань</strong>, багатими <strong>мозаїками</strong> та <strong>фресками</strong>.</p>

<h3>Що з нею було, коли монголи напали на Київ?</h3>
<p>У <strong>1240 році</strong> <strong>Софія Київська дивом вистояла</strong>. Монголи пограбували її, зірвали дорогоцінні оклади з ікон, але сам храм не зруйнували вщент.</p>

<h3>Як її відновлювали?</h3>
<p>У <strong>1630-х роках</strong> митрополит <strong>Петро Могила</strong> відремонтував храм. За гетьмана <strong>Івана Мазепи</strong> надбудували вежі та бані у стилі <strong>«українського бароко»</strong>.</p>

<h3>Як вона пережила Другу світову війну?</h3>
<p>При відступі у <strong>листопаді 1943 року</strong> окупанти замінували храм. <strong>Радянські сапери дивом встигли розмінувати собор</strong>.</p>

<h3>Як вона пережила повномасштабну війну?</h3>
<p>У 2022-2024 роках були <strong>вибиті шибки, пошкоджені фасади</strong>. <strong>Давні мозаїки 11 століття захистили спеціальними віброізолюючими екранами</strong>. Софія вистояла під усіма обстрілами.</p>`,
    contentEN: `<h3>Who wanted to build it?</h3>
<p>St. Sophia Cathedral was founded by <strong>Grand Prince Yaroslav the Wise</strong> (1019–1054). He dedicated the temple to Sophia — Divine Wisdom — to celebrate the victory over the Pechenegs and establish Kyivan Rus as a powerful Christian state equal to Byzantium.</p>

<h3>How long did it take to build?</h3>
<p>The main construction took about <strong>20 years</strong> (1017–1037). It was a giant project with <strong>13 domes</strong>, rich <strong>mosaics</strong> and <strong>frescoes</strong>.</p>

<h3>What happened when the Mongols attacked?</h3>
<p>In <strong>1240</strong>, <strong>St. Sophia miraculously survived</strong>. The Mongols looted it but did not destroy it.</p>

<h3>How was it restored?</h3>
<p>In the <strong>1630s</strong>, Metropolitan <strong>Petro Mohyla</strong> repaired the temple. Under Hetman <strong>Ivan Mazepa</strong>, towers and domes were added in <strong>"Ukrainian Baroque"</strong> style.</p>

<h3>How did it survive WWII?</h3>
<p>In <strong>November 1943</strong>, occupiers mined the cathedral. <strong>Soviet sappers miraculously defused it just hours before the explosion.</strong></p>

<h3>How did it survive the full-scale war?</h3>
<p>In 2022-2024, <strong>window panes were blown out, facades damaged</strong>. <strong>Ancient 11th-century mosaics were protected with vibration-insulating screens.</strong> St. Sophia has withstood all shelling.</p>`,
  },
  {
    id: "mongol-invasion-kyivan-rus",
    year: "1223-1648",
    accentColor: "#ffd700",
    title: {
      ua: "Монгольська навала та занепад Київської Русі",
      en: "The Mongol Invasion and Decline of Kyivan Rus",
    },
    description: {
      ua: "У 1240 році після героїчної оборони Київ упав під натиском монголів. Монголо-татарське іго тривало 240 років.",
      en: "In 1240, after a heroic defense, Kyiv fell to the Mongols and was destroyed. The Mongol-Tatar yoke lasted 240 years.",
    },
    images: [],
    contentUA: `<h3>Перша зустріч з монголами — битва на річці Калка (1223)</h3>
<p>Об'єднані сили руських князів разом із половцями виступили проти монголів. 31 травня 1223 року на річці <strong>Калка</strong> відбулася битва, яка стала трагедією. Через князівські чвари військо русів було розгромлено. Полонених князів монголи вбили — задавили під дерев'яним настилом.</p>

<h3>Нашестя Батия (1237-1241)</h3>
<p>У <strong>1237 році</strong> онук Чингісхана — <strong>хан Батий</strong> — розпочав масштабний похід. Руські князівства, роз'єднані та ослаблені, не змогли дати спільну відсіч.</p>

<h3>Падіння Києва (1240)</h3>
<p><strong>6 грудня 1240 року</strong> Київ упав. Місто було майже повністю знищене. <strong>Софія Київська</strong> дивом вціліла.</p>

<h3>Що таке монголо-татарське іго?</h3>
<p>Князі мали їздити до Орди та отримувати <strong>ярлик</strong> (дозвіл) на князювання. Руські землі повинні були платити важку <strong>данину</strong>.</p>

<h3>Наслідки навали</h3>
<p>З 74 великих міст монголи зруйнували 49. Занепало ремесло, припинилося літописання. Київ назавжди втратив статус політичного центру.</p>

<h3>Відродження Софії Київської за Петра Могили (1630-1640-ті)</h3>
<p>Митрополит <strong>Петро Могила</strong> розпочав масштабне відродження православ'я. Він реставрував Софію Київську, заснував <strong>Києво-Могилянську академію</strong> (1632).</p>`,
    contentEN: `<h3>First Encounter with the Mongols — Battle of the Kalka River (1223)</h3>
<p>Combined forces of Rus princes and Cumans marched against the Mongols. On May 31, 1223, the <strong>Battle of Kalka</strong> ended in tragedy due to princely infighting. Captive princes were crushed under a wooden platform.</p>

<h3>The Invasion of Batu Khan (1237-1241)</h3>
<p>In <strong>1237</strong>, <strong>Batu Khan</strong>, grandson of Genghis Khan, launched a massive campaign. The disunited Rus principalities could not mount a common defense.</p>

<h3>The Fall of Kyiv (1240)</h3>
<p>On <strong>December 6, 1240</strong>, Kyiv fell. The city was almost completely destroyed. <strong>St. Sophia Cathedral</strong> miraculously survived.</p>

<h3>What Was the Mongol-Tatar Yoke?</h3>
<p>Princes had to travel to the Horde and receive a <strong>yarlyk</strong> (permission) to rule. Rus lands had to pay heavy <strong>tribute</strong>.</p>

<h3>Consequences of the Invasion</h3>
<p>Of 74 large cities, the Mongols destroyed 49. Crafts declined, chronicle writing ceased. Kyiv forever lost its status as a political center.</p>

<h3>The Revival under Petro Mohyla (1630s-1640s)</h3>
<p>Metropolitan <strong>Petro Mohyla</strong> began a large-scale revival of Orthodoxy. He restored St. Sophia Cathedral and founded the <strong>Kyivan Mohyla Academy</strong> (1632).</p>`,
  },
  {
    id: "cossack-era-1658-1709",
    year: "1658-1709",
    accentColor: "#e85d04",
    title: {
      ua: "Козацька доба: Гетьманщина та Мазепа",
      en: "The Cossack Era: Hetmanate and Mazepa",
    },
    description: {
      ua: "Козацька держава бореться за виживання. Руїна, злет Мазепи та Полтавська битва, що змінила все.",
      en: "The Cossack state fights for survival. The Ruin, Mazepa's rise, and the Battle of Poltava that changed everything.",
    },
    images: [],
    contentUA: `<h3>Зародження козацтва</h3>
<p>Слово «козак» прийшло з тюркської мови — «kazak» означало «вільна людина». Спочатку так називали чоловіків, які йшли в степ на сезонну роботу. Але що далі, то більше людей залишалося там назавжди — краще померти вільним у степу, ніж жити рабом у пана.</p>

<h3>Як козаки жили</h3>
<p>Вдягнені у <strong>шаровари</strong>, підперезані чересом. За халявою чобота — завжди ніж. На голові — довгий чуб «оселедець». Легенда каже: коли козак помирає, Бог хапає його за цей чуб і витягує в рай.</p>

<h3>Козацька кухня</h3>
<p><strong>Основа раціону — сало</strong>. Воно не псувалося в походах, давало багато енергії. <strong>Куліш</strong> — пшоно із салом, «швидка їжа». <strong>Борщ</strong> варили на буряковому квасі без картоплі.</p>

<h3>Як воювали козаки</h3>
<p>Тактика — <strong>табір</strong>: вози в коло, рухома фортеця. Шабля — душа козака. На <strong>чайках</strong> (кораблях) плавали Чорним морем, грабували турецькі міста.</p>

<h3>Гетьманщина після Хмельницького</h3>
<p>Після смерті Хмельницького — «Руїна». 1667 рік — Андрусівське перемир'я поділило Україну навпіл по Дніпру.</p>

<h3>Мазепа та Полтавська битва</h3>
<p><strong>Іван Мазепа</strong> — гетьман з 1687 по 1709. Мріяв про незалежну Україну. Таємно домовився зі шведським королем Карлом XII. 27 червня 1709 року — <strong>Полтавська битва</strong>. Україна програла. Петро I спалив Батурин, убив 6 тисяч мирних жителів.</p>`,
    contentEN: `<h3>The Origins of the Cossacks</h3>
<p>The word "Cossack" comes from Turkic — "kazak" meant "free person." Better to die free in the steppe than live as a slave under a lord.</p>

<h3>How the Cossacks Lived</h3>
<p>Dressed in <strong>sharovary</strong> (wide pants), belted with a cheres. A knife always behind the boot. A long lock of hair — the "oseledets." Legend: when a Cossack dies, God grabs him by this lock and pulls him to heaven.</p>

<h3>Cossack Cuisine</h3>
<p><strong>The foundation — salo</strong> (cured pork fat). Didn't spoil on campaigns. <strong>Kulish</strong> — millet with salo, the "fast food." <strong>Borshch</strong> was made with beet kvass, no potatoes.</p>

<h3>How Cossacks Fought</h3>
<p>Tactics — the <strong>tabor</strong>: wagons in a circle, a mobile fortress. The sabre was a Cossack's soul. On <strong>chaiky</strong> (ships), they sailed the Black Sea and raided Turkish cities.</p>

<h3>The Hetmanate After Khmelnytsky</h3>
<p>After Khmelnytsky's death — "The Ruin." In 1667, the Truce of Andrusovo divided Ukraine along the Dnipro.</p>

<h3>Mazepa and the Battle of Poltava</h3>
<p><strong>Ivan Mazepa</strong> — Hetman from 1687 to 1709. Dreamed of an independent Ukraine. Secretly allied with Swedish King Charles XII. June 27, 1709 — <strong>Battle of Poltava</strong>. Ukraine lost. Peter I burned Baturyn, killed 6,000 civilians.</p>`,
  },
  {
    id: "battle_poltava",
    year: "1709",
    accentColor: "#e85d04",
    title: {
      ua: "Полтавська битва: Доля України під загрозою",
      en: "Battle of Poltava: The Turning Point",
    },
    description: {
      ua: "Союз Мазепи зі Швецією, спалення Батурина та битва, що призвела до втрати козацьких вольностей.",
      en: "Mazepa's alliance with Sweden, the burning of Baturyn, and the battle that led to the loss of Cossack freedoms.",
    },
    images: [],
    contentUA: `<h3>Через що все почалося?</h3>
<p>Петро I скасовував козацькі вольності одну за одною. Мазепа таємно домовився зі шведським королем Карлом XII: якщо Швеція переможе — Україна стане незалежною.</p>

<h3>Хронологія катастрофи</h3>
<p><strong>Жовтень 1708:</strong> Мазепа відкрито переходить на бік Швеції. <strong>Листопад 1708:</strong> Московські війська спалюють Батурин, вирізавши 11-14 тисяч мирних жителів. <strong>27 червня 1709:</strong> Полтавська битва — повна поразка.</p>

<h3>Хто був головним?</h3>
<p><strong>Іван Мазепа</strong> — гетьман, європейської культури дипломат. <strong>Карл XII</strong> — король Швеції, поранений перед битвою. <strong>Петро I</strong> — прагматичний реформатор.</p>

<h3>Головний підсумок</h3>
<p>Швеція втратила статус супердержави. Росія перетворилася на імперію. Для України — почався період жорстокого обмеження прав Гетьманщини та знищення козацьких вольностей.</p>`,
    contentEN: `<h3>How Did It All Begin?</h3>
<p>Peter I was abolishing Cossack freedoms one by one. Mazepa secretly allied with Swedish King Charles XII: if Sweden wins — Ukraine becomes independent.</p>

<h3>Timeline of the Disaster</h3>
<p><strong>October 1708:</strong> Mazepa openly sides with Sweden. <strong>November 1708:</strong> Muscovite troops burn Baturyn, massacring 11,000–14,000 civilians. <strong>June 27, 1709:</strong> Battle of Poltava — complete defeat.</p>

<h3>Who Were the Key Figures?</h3>
<p><strong>Ivan Mazepa</strong> — Hetman, diplomat of European culture. <strong>Charles XII</strong> — King of Sweden, wounded before battle. <strong>Peter I</strong> — pragmatic reformer.</p>

<h3>The Main Outcome</h3>
<p>Sweden lost superpower status. Russia became an empire. For Ukraine — a period of harsh restrictions on the Hetmanate's rights and destruction of Cossack freedoms began.</p>`,
  },
  {
    id: "unr_independence_1918",
    year: "1918",
    accentColor: "#e85d04",
    title: {
      ua: "Проголошення Незалежності УНР",
      en: "Proclamation of Independence of the UPR",
    },
    description: {
      ua: "Четвертий Універсал проголошує Україну вільною та суверенною державою. Народження сучасної української державності.",
      en: "The Fourth Universal proclaims Ukraine a free and sovereign state. The birth of modern Ukrainian statehood.",
    },
    images: [],
    contentUA: `<h3>Чому саме 22 січня?</h3>
<p>Коли восени 1917 року більшовики захопили владу, українські лідери збагнули: домовлятися більше нема з ким. У ніч з 22 на 23 січня 1918 року Центральна Рада ухвалила Четвертий Універсал: <strong>«Однині Українська Народна Республіка стає самостійною, ні від кого незалежною, вільною, суверенною державою»</strong>.</p>

<h3>Хто був головним?</h3>
<p><strong>Михайло Грушевський</strong> — голова Центральної Ради, вчений-романтик. <strong>Володимир Винниченко</strong> — письменник-соціаліст. <strong>Симон Петлюра</strong> — один із небагатьох, хто розумів: без сильної армії незалежність не втримати.</p>

<h3>Як тоді жили?</h3>
<p>Культурний вибух: відкривалися українські гімназії, театри, з'явилися перші власні гроші — гривні. Але побут був надважким: перебої з постачанням, знецінення грошей, комендантська година.</p>

<h3>Рекрутинг в армію</h3>
<p>Лідери розпустили мільйонну армію, боячись мілітаризму. Рекрутинг — виключно добровільний: <strong>Вільне козацтво</strong>, <strong>Січові Стрільці</strong>, <strong>Студентський курінь</strong>. 29 січня 1918 — бій під Крутами.</p>`,
    contentEN: `<h3>Why January 22?</h3>
<p>When the Bolsheviks seized power in 1917, Ukrainian leaders realized there was no one left to negotiate with. On the night of January 22-23, 1918, the Central Rada adopted the Fourth Universal: <strong>"From now on, the Ukrainian People's Republic becomes an independent, free, sovereign state."</strong></p>

<h3>Who Were the Leaders?</h3>
<p><strong>Mykhailo Hrushevsky</strong> — Chairman of the Central Rada, academic romantic. <strong>Volodymyr Vynnychenko</strong> — writer and socialist. <strong>Symon Petliura</strong> — one of the few who understood that without a strong army, independence could not be maintained.</p>

<h3>How Did People Live?</h3>
<p>Cultural explosion: Ukrainian gymnasiums, theaters, first national currency — hryvnias. But daily life was extremely difficult: food shortages, money depreciation, curfews.</p>

<h3>Army Recruitment</h3>
<p>Leaders disbanded the million-strong army, fearing militarism. Recruitment was strictly volunteer-based: <strong>Free Cossacks</strong>, <strong>Sich Riflemen</strong>, <strong>Student Battalion</strong>. January 29, 1918 — Battle of Kruty.</p>`,
  },
  {
    id: "holodomor_1933",
    year: "1932-1933",
    accentColor: "#94a3b8",
    title: {
      ua: "Голодомор 1932-1933: Геноцид українського народу",
      en: "Holodomor 1932-1933: Genocide of the Ukrainian People",
    },
    description: {
      ua: "Спланований голод як зброя знищення української нації. Мільйони невинних жертв.",
      en: "A planned famine as a weapon of destruction of the Ukrainian nation. Millions of innocent victims.",
    },
    images: [],
    contentUA: `<h3>Чому це сталося?</h3>
<p>Сталін панічно боявся втратити Україну. У серпні 1932 року він написав: <strong>«Якщо не візьмемося зараз за виправлення становища в Україні, Україну можемо втратити»</strong>. Для приборкання українців обрано найстрашнішу зброю — штучний голод.</p>

<h3>Механізм злочину</h3>
<p><strong>Нереальні плани хлібозаготівель.</strong> <strong>«Закон про п'ять колосків»</strong> — за кілька колосків розстріл або 10 років. <strong>«Чорні дошки»</strong> — повна блокада сіл. <strong>Паспортна блокада</strong> — селяни не могли виїхати.</p>

<h3>Як виживали люди?</h3>
<p>Викопували гнилий буряк із-під снігу. Збирали кропиву, лободу. Ловили мишей, жаб, котів. Варили шкіряне взуття. <strong>Пік смертності — червень 1933: 24 людини щохвилини.</strong></p>

<h3>Світове визнання</h3>
<p><strong>Понад 33 країни</strong> офіційно визнали Голодомор геноцидом. Потужна хвиля визнань відбулася після 2022 року — світ побачив сучасну російську агресію і збагнув коріння ненависті.</p>`,
    contentEN: `<h3>Why Did It Happen?</h3>
<p>Stalin was panicked at the prospect of losing Ukraine. In August 1932, he wrote: <strong>"If we do not now correct the situation in Ukraine, we may lose Ukraine."</strong> The most terrible weapon was chosen — artificial famine.</p>

<h3>The Mechanism of the Crime</h3>
<p><strong>Unrealistic grain procurement plans.</strong> <strong>The "Five Spikelets" Law</strong> — execution or 10 years for a few spikelets. <strong>"Black Boards"</strong> — complete blockade of villages. <strong>Passport blockade</strong> — peasants couldn't leave.</p>

<h3>How Did People Survive?</h3>
<p>Dug up rotten beets from under snow. Collected nettles, goosefoot. Caught mice, frogs, cats. Boiled leather shoes. <strong>Peak mortality — June 1933: 24 people every minute.</strong></p>

<h3>International Recognition</h3>
<p><strong>More than 33 countries</strong> have officially recognized the Holodomor as genocide. A powerful wave of recognition occurred after 2022 — the world saw modern Russian aggression and understood the roots of hatred.</p>`,
  },
  {
    id: "upa_resistance_1945_1954",
    year: "1945-1954",
    accentColor: "#94a3b8",
    title: {
      ua: "Післявоєнний опір УПА: Боротьба в підпіллі",
      en: "Post-War UPA Resistance: The Underground Struggle",
    },
    description: {
      ua: "Від відкритих боїв до глибокого підпілля. Як УПА понад десятиліття боролася проти радянської тоталітарної машини.",
      en: "From open combat to deep underground. How the UPA fought against the Soviet totalitarian machine for over a decade.",
    },
    images: [],
    contentUA: `<h3>Еволюція опору</h3>
<p><strong>1945-1946:</strong> Відкрите збройне протистояння — великі підрозділи УПА. <strong>1947-1949:</strong> Перехід до партизанської війни — малі мобільні групи. <strong>1950-1954:</strong> Глибоке підпілля — боротьба в бункерах (криївках).</p>

<h3>Феномен криївки</h3>
<p>Коли радянські війська заповнили ліси, повстанці пішли під землю. Криївки будували під хатами, у криницях. 2-5 осіб жили роками у повній темряві.</p>

<h3>Як радянська влада знищувала опір</h3>
<p><strong>Операція «Захід» (1947):</strong> за один день вивезли до Сибіру 77 тисяч українців — жінок, дітей, літніх людей. <strong>Спецгрупи МДБ:</strong> переодягалися у форму УПА, грабували та вбивали мирних жителів для дискредитації.</p>

<h3>Кінець опору</h3>
<p><strong>5 березня 1950</strong> — загинув Головний командир УПА <strong>Роман Шухевич</strong>. Останній збройний бій — <strong>14 квітня 1960</strong>. Повстанець <strong>Ілля Оберишин</strong> провів у підпіллі <strong>40 років</strong>, вийшов лише у грудні 1991.</p>`,
    contentEN: `<h3>Evolution of Resistance</h3>
<p><strong>1945-1946:</strong> Open armed confrontation — large UPA units. <strong>1947-1949:</strong> Transition to guerrilla warfare — small mobile groups. <strong>1950-1954:</strong> Deep underground — struggle in bunkers (kryivkas).</p>

<h3>The Kryivka Phenomenon</h3>
<p>When Soviet forces filled the forests, insurgents went underground. Bunkers were built under houses, in wells. 2-5 people lived for years in complete darkness.</p>

<h3>How Soviet Authorities Destroyed the Resistance</h3>
<p><strong>Operation "West" (1947):</strong> deported 77,000 Ukrainians to Siberia in one day. <strong>MGB Special Groups:</strong> dressed in UPA uniforms, robbed and killed civilians to discredit the resistance.</p>

<h3>End of Resistance</h3>
<p><strong>March 5, 1950</strong> — UPA Commander <strong>Roman Shukhevych</strong> was killed. Last armed clash — <strong>April 14, 1960</strong>. Insurgent <strong>Illia Oberyshyn</strong> spent <strong>40 years</strong> underground, emerging only in December 1991.</p>`,
  },
  {
    id: "revolution_of_dignity_2013_2014",
    year: "2013-2014",
    accentColor: "#0ea5e9",
    title: {
      ua: "Революція Гідності: Небесна Сотня та початок російської агресії",
      en: "Revolution of Dignity: The Heavenly Hundred and Russian Aggression",
    },
    description: {
      ua: "Коли українці стали на захист своєї гідності. Від Євромайдану — до Небесної Сотні та початку війни.",
      en: "When Ukrainians stood up for their dignity. From Euromaidan to the Heavenly Hundred and the beginning of war.",
    },
    images: [],
    contentUA: `<h3>Іскра, що підпалила країну</h3>
<p><strong>21 листопада 2013</strong> — Янукович відмовився підписувати Угоду з ЄС. <strong>Ніч на 30 листопада</strong> — «Беркут» брутально побив студентів. Наступного дня на вулиці вийшов мільйон людей.</p>

<h3>Кульмінація: 18-20 лютого 2014</h3>
<p>Силовики штурмували Майдан, розстрілювали протестувальників на Інститутській. <strong>Загиблих назвали Небесною Сотнею.</strong> Янукович утік до Росії.</p>

<h3>Як Росія почала війну</h3>
<p><strong>Крим (лютий-березень 2014):</strong> «Зелені чоловічки», фейковий референдум, анексія. <strong>Донбас (квітень 2014):</strong> загін Гіркіна захопив Слов'янськ. Добровольчі батальйони — вчорашні студенти Майдану — пішли на фронт у цивільних кросівках.</p>`,
    contentEN: `<h3>The Spark That Ignited the Country</h3>
<p><strong>November 21, 2013</strong> — Yanukovych refused to sign the EU Agreement. <strong>Night of November 30</strong> — "Berkut" brutally beat students. The next day, a million people took to the streets.</p>

<h3>Climax: February 18-20, 2014</h3>
<p>Security forces stormed the Maidan, shot protesters on Instytutska Street. <strong>The fallen were named the Heavenly Hundred.</strong> Yanukovych fled to Russia.</p>

<h3>How Russia Started the War</h3>
<p><strong>Crimea (Feb-March 2014):</strong> "Little green men," fake referendum, annexation. <strong>Donbas (April 2014):</strong> Girkin's unit captured Sloviansk. Volunteer battalions — former Maidan students — went to the front in civilian sneakers.</p>`,
  },
  {
    id: "battles_2014_2015",
    year: "2014-2015",
    accentColor: "#0ea5e9",
    title: {
      ua: "Перша битва за Україну — Слов'янськ, Іловайськ, ДАП",
      en: "The First Battle for Ukraine — Sloviansk, Ilovaisk, DAP",
    },
    description: {
      ua: "Перша перемога, найболючіша трагедія та символ надлюдської стійкості.",
      en: "The first victory, the greatest tragedy, and the symbol of incredible resilience.",
    },
    images: [],
    contentUA: `<h3>Слов'янськ: перша перемога</h3>
<p><strong>Квітень-липень 2014.</strong> Облога міста, ключова гора Карачун. 5 липня загін Гіркіна втік. Перший великий стратегічний успіх ЗСУ.</p>

<h3>Іловайськ: підступність ворога</h3>
<p><strong>Серпень 2014.</strong> Регулярні війська РФ без оголошення війни перетнули кордон, оточили українців. 29 серпня розстріляли колону. <strong>366 загиблих, 429 поранених.</strong></p>

<h3>Донецький аеропорт: «Кіборги витримали, не витримав бетон»</h3>
<p><strong>242 дні</strong> оборони. Ворог назвав українців «кіборгами» за неймовірну стійкість. ДАП став <strong>українськими Фермопілами</strong>.</p>`,
    contentEN: `<h3>Sloviansk: The First Victory</h3>
<p><strong>April-July 2014.</strong> Siege of the city, key Karachun Mountain. On July 5, Girkin's group fled. The first major strategic success of the Armed Forces of Ukraine.</p>

<h3>Ilovaisk: The Enemy's Treachery</h3>
<p><strong>August 2014.</strong> Regular Russian troops crossed the border without declaration of war, encircled Ukrainian forces. On August 29, they shot a column. <strong>366 killed, 429 wounded.</strong></p>

<h3>Donetsk Airport: "Cyborgs Survived, Concrete Did Not"</h3>
<p><strong>242 days</strong> of defense. The enemy called Ukrainians "cyborgs" for their incredible resilience. DAP became <strong>Ukraine's Thermopylae</strong>.</p>`,
  },
  {
    id: "volunteer_movement_2014",
    year: "2014",
    accentColor: "#0ea5e9",
    title: {
      ua: "Волонтерський рух 2014: Феномен «четвертого роду військ»",
      en: 'Volunteer Movement 2014: The "Fourth Branch of the Military"',
    },
    description: {
      ua: "Як український народ став тилом для своєї армії. Народження масового волонтерства під час війни.",
      en: "How the Ukrainian people became the rear for their army. The birth of mass volunteering during the war.",
    },
    images: [],
    contentUA: `<h3>Як народ став тилом</h3>
<p>Весною 2014 армія була розкрадена: солдати висувалися без бронежилетів, у цивільному взутті. Тоді народився <strong>волонтерський рух</strong> без аналогів у світовій історії.</p>

<h3>ДНК Майдану</h3>
<p>Волонтери — пряма еволюція інфраструктури Революції Гідності. Кулінарні сотні перепрофілювалися на сушку сухпайків. Телефонні бази пошуку зниклих — на збор коштів на бронежилети.</p>

<h3>Народна логістика</h3>
<p><strong>Мікрорівень:</strong> пункти збору, маскувальні сітки. <strong>Мезорівень:</strong> волонтерські «бусики» на передову. <strong>Макрорівень:</strong> фонди «Повернись живим», «Крила Фенікса» — тепловізори, безпілотники, софт «Кропива».</p>

<h3>Ключова цифра</h3>
<p>У перші місяці війни до <strong>80%</strong> матеріальних потреб бійців закривав народ зі своєї кишені.</p>`,
    contentEN: `<h3>How the People Became the Rear</h3>
<p>In spring 2014, the army was stripped: soldiers deployed without body armor, in civilian shoes. The <strong>volunteer movement</strong> was born — without parallel in world history.</p>

<h3>The DNA of Maidan</h3>
<p>Volunteers were a direct evolution of the Revolution of Dignity's infrastructure. Cooking units repurposed for drying rations. Missing persons databases became fundraising for body armor.</p>

<h3>People's Logistics</h3>
<p><strong>Micro-level:</strong> collection points, camouflage nets. <strong>Meso-level:</strong> volunteer minivans to the front. <strong>Macro-level:</strong> foundations "Come Back Alive," "Kryla Feniksa" — thermal imagers, drones, "Kropyva" software.</p>

<h3>Key Figure</h3>
<p>In the first months of the war, up to <strong>80%</strong> of soldiers' material needs were covered by the people from their own pockets.</p>`,
  },
];
