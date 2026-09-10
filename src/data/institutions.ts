import { Institution } from '../types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-01',
    name: 'جامع الجزائر الأعظم ودار القرآن الكريم',
    type: 'mosque',
    wilayaCode: '16',
    wilayaNameAr: 'الجزائر العاصمة',
    commune: 'المحمدية',
    address: 'شارع جيش التحرير الوطني، المحمدية، الجزائر العاصمة',
    lat: 36.7348,
    lng: 3.1437,
    foundedYear: 2019,
    historicalBio: 'أكبر مسجد في الجزائر وإفريقيا وثالث أكبر مسجد في العالم، يضم دار القرآن ومدرسة عليا للعلوم الإسلامية ومكتبة كبرى تتسع لآلاف المراجع والباحثين، مع مئذنة هي الأطول في العالم (265 متراً).',
    imamOrSheikh: 'الشيخ عميد جامع الجزائر ونخبة من كبار المقرئين الجزائريين',
    studentCount: 1850,
    teachersCount: 65,
    capacity: 120000,
    phone: '+213 21 89 20 00',
    email: 'contact@djamaa-eldjazair.dz',
    services: [
      'حلقات الإقراء العالي والإجازات المسندة',
      'تعليم القرآن الكريم برواية ورش عن نافع وحفص',
      'المدرسة العليا للعلوم الإسلامية ومرحلة الدكتوراه',
      'مكتبة رقمية وورقية متخصصة',
      'متحف الحضارة الإسلامية وقاعة مؤتمرات دولية',
      'دروس دينية مفتوحة وتفسير أسبوعي'
    ],
    facilities: ['مكتبة كبرى', 'قاعات تدريس مجهزة', 'متحف إسلامي', 'مواقف سيارات', 'مصلى نساء مستقل', 'مرافق لذوي الاحتياجات الخاصة'],
    photos: [
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 342,
    verified: true,
    registrationNumber: 'REG-DZ-16-2019-001',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - صرح وطني مرجعي 16/01',
    riwayaDefault: 'ورش عن نافع وحفص عن عاصم',
    quranicMethod: 'الإقراء العالي والمخابر الصوتية الحديثة والإجازات المسندة',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-01',
        authorName: 'أحمد بن عيسى',
        userRole: 'student',
        rating: 5,
        comment: 'صرح إسلامي مهيب، حلقات الإقراء على أيدي شيوخ متقنين برواية ورش من طريق الأزرق والأصبهاني.',
        date: '2026-05-14',
        verifiedVisitor: true
      },
      {
        id: 'rev-02',
        authorName: 'د. فاطمة الزهراء بوحيرد',
        userRole: 'parent',
        rating: 5,
        comment: 'تنظيم محكم لصفوف التحفيظ والمراجعة، ونظام إلكتروني راقي لمتابعة تقدم الأبناء.',
        date: '2026-06-20',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'السبت إلى الأربعاء', dayFr: 'Sam - Mer', timeSlot: '08:00 - 12:00', targetGroup: 'طلبة الإجازة والمدرسة العليا', teacher: 'الشيخ المقرئ د. عبد القادر', subject: 'إقراء القرآن وإتقان الأداء' },
      { dayAr: 'يومياً بعد العصر', dayFr: 'Tous les jours (Asr)', timeSlot: '16:30 - 18:30', targetGroup: 'أشبال وناشئة (حفظ وتثبيت)', teacher: 'نخبة أساتذة دار القرآن', subject: 'حفظ الورد ومخارج الحروف' },
      { dayAr: 'الجمعة والسبت', dayFr: 'Ven - Sam', timeSlot: '09:00 - 11:30', targetGroup: 'حلقات النساء والفتيات', teacher: 'الأستاذة خديجة مقرئة مجازة', subject: 'أحكام التجويد ورواية ورش' }
    ]
  },
  {
    id: 'inst-02',
    name: 'المدرسة القرآنية والزاوية البلقايدية الهبرية',
    type: 'zawiya',
    wilayaCode: '31',
    wilayaNameAr: 'وهران',
    commune: 'بئر الجير',
    address: 'حي بلقايد، بلدية بئر الجير، وهران',
    lat: 35.7196,
    lng: -0.5312,
    foundedYear: 1968,
    historicalBio: 'من أعرق المنارات العلمية والقرآنية في الغرب الجزائري، أسسها الشيخ سيدي محمد بلقايد قدس الله سره، وتشتهر بتنظيم "ملتقى الدروس المحمدية" سنوياً بحضور علماء العالم الإسلامي، مع نظام داخلي كامل لطلبة القرآن والعلوم الشرعية.',
    imamOrSheikh: 'الشيخ سيدي عبد اللطيف بلقايد',
    studentCount: 720,
    teachersCount: 32,
    capacity: 2500,
    phone: '+213 41 74 12 30',
    email: 'zawiya.belkaidia@algeria-quran.org',
    services: [
      'نظام إيواء وتكفل تام بطلبة القرآن من جميع الولايات',
      'حفظ القرآن الكريم كاملاً بالألواح والصلصال والخط المغربي الأصيل',
      'دراسة متون الفقه المالكي وأصول النحو واللغة',
      'منح الإجازات القرآنية بالسند المتصل إلى رسول الله ﷺ',
      'ملتقى الدروس المحمدية السنوي في رمضان'
    ],
    facilities: ['إقامة داخلية مجانية', 'مطعم مدرسي', 'قاعة ألواح تقليدية', 'مكتبة مخطوطات نادرة', 'مسجد جامع'],
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewsCount: 289,
    verified: true,
    registrationNumber: 'REG-DZ-31-1968-002',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - زاوية علمية معتمدة 31/05',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الألواح الخشبية والدواة والصلصال والخط المغربي الأصيل',
    hasBoarding: true,
    hasWomenClasses: false,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-03',
        authorName: 'محمد لمين السطايفي',
        userRole: 'student',
        rating: 5,
        comment: 'حفظت القرآن الكريم هنا في 3 سنوات بالطريقة الجزائرية العريقة باللوح والدواة والصلصال، جزاهم الله عنا خيراً.',
        date: '2026-04-10',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً (الفجر إلى الشروق)', dayFr: 'Tous les jours (Fadjr)', timeSlot: '05:30 - 07:30', targetGroup: 'طلبة التحفيظ الداخليين', teacher: 'الشيخ بن عودة والمشرفين', subject: 'كتابة واستظهار اللوح الصباحي' },
      { dayAr: 'يومياً بعد الظهر والمغرب', dayFr: 'Tous les jours (Dohr/Maghreb)', timeSlot: '13:30 - 15:30 و 18:00 - 20:00', targetGroup: 'طلبة السلكة والمراجعة', teacher: 'المقرئ الشيخ البشير', subject: 'السلكة والمراجعة وتثبيت المحفوظ' }
    ]
  },
  {
    id: 'inst-03',
    name: 'معهد ودار القرآن الإمام عبد الحميد بن باديس',
    type: 'dar_quran',
    wilayaCode: '25',
    wilayaNameAr: 'قسنطينة',
    commune: 'قسنطينة المركز',
    address: 'طريق باتنة، بالقرب من مسجد الأمير عبد القادر، قسنطينة',
    lat: 36.3533,
    lng: 6.6025,
    foundedYear: 1931,
    historicalBio: 'حاضرة القرآن ووريثة نهضة جمعية العلماء المسلمين الجزائريين بقيادة الإمام المجدد عبد الحميد بن باديس. تقوم على تعليم القرآن الكريم، علوم التفسير، والأدب العربي الأصيل وفق منهج تربوي عصري متكامل.',
    imamOrSheikh: 'الشيخ الأستاذ عمار طالبي ومقرئو قسنطينة',
    studentCount: 960,
    teachersCount: 45,
    capacity: 3000,
    phone: '+213 31 92 45 10',
    email: 'benbadis.darquran@constantine.dz',
    services: [
      'أكاديمية النشء الصاعد لتحفيظ القرآن والتربية القيمية',
      'دورات مكثفة في قواعد التجويد برواية ورش عن نافع',
      'إجازات قرآنية في الشاطبية والدرة وطيبة النشر',
      'تعليم اللغة العربية للناطقين بغيرها وللناشئة',
      'مكتبة ابن باديس العامة وورشات تحسين الخط العربي'
    ],
    facilities: ['مخابر صوتيات لتصحيح التلاوة', 'مكتبة علمية', 'مسرح وقاعة محاضرات', 'روضة قرآنية نموذجية', 'مصلى فسيح'],
    photos: [
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewsCount: 195,
    verified: true,
    registrationNumber: 'REG-DZ-25-1931-003',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - معهد ودار قرآن معتمد 25/11',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'المخابر الصوتية الحديثة والأكاديمية القرآنية',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-04',
        authorName: 'ياسين بن صالح',
        userRole: 'teacher',
        rating: 5,
        comment: 'معهد رائد في استخدام الوسائل التقنية الحديثة ومخابر الصوت لضبط مخارج الحروف وصفاتها.',
        date: '2026-03-22',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'السبت والثلاثاء والخميس', dayFr: 'Sam, Mar, Jeu', timeSlot: '17:00 - 19:30', targetGroup: 'طلبة المدارس والثانويات', teacher: 'الشيخ عبد الحفيظ بن باديس', subject: 'الورد القرآني وقواعد التجويد' },
      { dayAr: 'الجمعة صباحاً', dayFr: 'Vendredi Matin', timeSlot: '08:30 - 11:30', targetGroup: 'حلقات المراجعة الدورية للكبار', teacher: 'المقرئ الشيخ الهادي', subject: 'استظهار حزبين والتصحيح الدقيق' }
    ]
  },
  {
    id: 'inst-04',
    name: 'زاوية سيدي أحمد بن يوسف والمدارس القرآنية بمليانة',
    type: 'zawiya',
    wilayaCode: '44',
    wilayaNameAr: 'عين الدفلى',
    commune: 'مليانة',
    address: 'حي القصبة العتيقة، مليانة، عين الدفلى',
    lat: 36.3021,
    lng: 2.2285,
    foundedYear: 1520,
    historicalBio: 'من أقدم المعالم الدينية والروحية في الجزائر، شيدت في القرن السادس عشر وخرجت أجيالاً من العلماء والفقهاء وحفظة كتاب الله عبر القرون، وتتميز بعمارتها الإسلامية الموريسكية الساحرة.',
    imamOrSheikh: 'الشيخ المقدم بن يوسف وشيوخ مليانة',
    studentCount: 420,
    teachersCount: 18,
    capacity: 1200,
    phone: '+213 27 57 11 09',
    email: 'zawiya.miliana@heritage-quran.dz',
    services: [
      'تحفيظ القرآن الكريم بالألواح الخشبية التقليدية',
      'دروس في التصوف السني والسلوك وفقه المعاملات',
      'إطعام عابري السبيل وطلبة القرآن من المعوزين',
      'حلقات مديح ديني وإنشاد تراثي جزائري'
    ],
    facilities: ['فناء موريسكي أثري', 'قاعة ألواح تاريخية', 'نبع ماء طبيعي عذب', 'مكتبة مخطوطات وقفية'],
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 112,
    verified: true,
    registrationNumber: 'REG-DZ-44-1520-004',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - قيد أثري 44/08',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الألواح الخشبية والمداد الطبيعي التقليدي',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: false,
    reviews: [
      {
        id: 'rev-05',
        authorName: 'بلقاسم الشلفي',
        userRole: 'visitor',
        rating: 5,
        comment: 'مكان تنشرح له الصدور، عبق التاريخ وبركة القرآن في كل زاوية.',
        date: '2026-02-18',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً ما عدا الأحد', dayFr: 'Tous les jours sauf Dim', timeSlot: '07:00 - 11:30', targetGroup: 'حفظة القرآن الصغار', teacher: 'الشيخ العربي الملياني', subject: 'كتابة وتلاوة القرآن باللوح' }
    ]
  },
  {
    id: 'inst-05',
    name: 'المدرسة القرآنية الشيخ إبراهيم بيوض والقرى القرآنية',
    type: 'quranic_school',
    wilayaCode: '47',
    wilayaNameAr: 'غرداية',
    commune: 'القرارة',
    address: 'مجمع معهد الحياة القرآني، بلدية القرارة، وادي ميزاب، غرداية',
    lat: 32.7889,
    lng: 4.4981,
    foundedYear: 1925,
    historicalBio: 'نموذج رائد عالمياً في التنظيم الدقيق للمدارس القرآنية والتعليم المجتمعي المتكافل، أسسها العلامة الشيخ إبراهيم بيوض عضو جمعية العلماء المسلمين. تمتاز بنسب حفظ تلامس 100% بين الناشئة مع إتقان العربية والعلوم الحديثة.',
    imamOrSheikh: 'الشيخ الدكتور مصطفى باجو ونخبة أساتذة معهد الحياة',
    studentCount: 2400,
    teachersCount: 98,
    capacity: 4000,
    phone: '+213 29 88 33 22',
    email: 'hayat.institute@ghardaia-quran.dz',
    services: [
      'نظام حفظ متكامل يبدأ من مرحلة الروضة القرآنية إلى التخرج',
      'حفظ القرآن الكريم بروايتي ورش وقالون عن نافع',
      'نظام متابعة إلكتروني يومي للورد والمراجعة للأسر والطلبة',
      'مخيمات قرآنية صيفية مكثفة تستقطب طلبة من كافة ولايات الوطن',
      'دورات إتقان الترتيل ومقامات الأداء القرآني السليم'
    ],
    facilities: ['مركب تعليمي متكامل', 'مساكن طلابية مجهزة', 'ملاعب رياضية ومسابح ترفيهية', 'مخابر لغات وعلوم', 'قاعة مؤتمرات كبرى'],
    photos: [
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewsCount: 512,
    verified: true,
    registrationNumber: 'REG-DZ-47-1925-005',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - مجمع نموذجي معتمد 47/01',
    riwayaDefault: 'ورش وقالون عن نافع المدني',
    quranicMethod: 'المنهج المؤسسي التكاملي والمتابعة الإلكترونية والألواح والمصاحف',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-06',
        authorName: 'عمر بن يحيى',
        userRole: 'parent',
        rating: 5,
        comment: 'أرقى نظام تعليمي وتربوي قرآني رأيته، انضباط مذهل في المواعيد وإتقان متقن للتلاوة والأحكام.',
        date: '2026-07-02',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً (السبت - الخميس)', dayFr: 'Sam - Jeu', timeSlot: '07:30 - 13:00', targetGroup: 'طلبة المعهد النظامي', teacher: 'مشايخ المعهد المعتمدون', subject: 'القرآن والتفسير وعلوم الحديث' },
      { dayAr: 'الفترة المسائية', dayFr: 'Soirée', timeSlot: '17:00 - 19:30', targetGroup: 'طلبة المدارس الحكومية للدعم القرآني', teacher: 'الأساتذة المربون', subject: 'تثبيت المحفوظ واختبارات تكيفية' }
    ]
  },
  {
    id: 'inst-06',
    name: 'زاوية سيدي الهامل القاسمية لتحفيظ القرآن',
    type: 'zawiya',
    wilayaCode: '28',
    wilayaNameAr: 'المسيلة',
    commune: 'الهامل - بوسعادة',
    address: 'قرية الهامل العريقة، 12 كم جنوب بوسعادة، ولاية المسيلة',
    lat: 35.1583,
    lng: 4.1950,
    foundedYear: 1848,
    historicalBio: 'شعلة العلم والجهاد والتصوف السني، أسسها سيدي محمد بن أبي القاسم عام 1848، واشتهرت تاريخياً بكونها ملاذاً للمجاهدين ومركزاً للثقافة الإسلامية، وخرجت آلاف القراء والحفظة من شتى ربوع المغرب العربي.',
    imamOrSheikh: 'الشيخ المأمون القاسمي الحسني وشيوخ الزاوية',
    studentCount: 850,
    teachersCount: 38,
    capacity: 3500,
    phone: '+213 35 52 80 15',
    email: 'contact@zawiya-elhamel.dz',
    services: [
      'تعليم القرآن الكريم وتخريج الحفظة برواية ورش',
      'إيواء وتغذية كاملة مجانية لجميع الطلبة',
      'تدريس الفقه المالكي ومتن خليل ورسالة ابن أبي زيد القيرواني',
      'تنظيم الاحتفالات بالمولد النبوي والختمات القرآنية'
    ],
    facilities: ['مركب الزاوية التاريخي', 'دار الضيافة الكبرى', 'إقامة الطلاب الداخلية', 'مكتبة نفائس التراث والمخطوطات'],
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 240,
    verified: true,
    registrationNumber: 'REG-DZ-28-1848-006',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - زاوية قرآنية تاريخية 28/02',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'اللوح والصلصال والسلكة اليومية والإسناد المتصل',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-07',
        authorName: 'سفيان البوسعادي',
        userRole: 'visitor',
        rating: 5,
        comment: 'كرم الضيافة وعظمة القرآن، الزاوية القاسمية فخر للجزائر جمعاء.',
        date: '2026-05-30',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'طوال أيام الأسبوع', dayFr: '7j/7', timeSlot: '05:00 - 21:00', targetGroup: 'طلبة الزاوية المقيمون', teacher: 'شيوخ الإقراء بالقاسمية', subject: 'برنامج الحفظ اليومي، التسميع، والمتون' }
    ]
  },
  {
    id: 'inst-07',
    name: 'مدرسة سيدي عبد الرحمن الثعالبي القرآنية ومسجد القصبة',
    type: 'mosque',
    wilayaCode: '16',
    wilayaNameAr: 'الجزائر العاصمة',
    commune: 'القصبة السفلى',
    address: 'شارع الثعالبي، حي القصبة العتيق، الجزائر العاصمة',
    lat: 36.7865,
    lng: 3.0601,
    foundedYear: 1471,
    historicalBio: 'منارة تاريخية روحية للعاصمة الجزائرية، منسوبة إلى الإمام المفسر سيدي عبد الرحمن الثعالبي صاحب تفسير "الجواهر الحسان في تفسير القرآن". تجمع بين عراقة قصبة الجزائر وتخريج نخبة من أصوات القرآن العذبة.',
    imamOrSheikh: 'الشيخ الإمام المقرئ محمد دراجي',
    studentCount: 380,
    teachersCount: 16,
    capacity: 1000,
    phone: '+213 21 73 40 12',
    email: 'thaalibi.quran@algiers.dz',
    services: [
      'تحفيظ القرآن للصغار مع التركيز على الترتيل الجزائري الأصيل',
      'تفسير آيات الأحكام وتدبر القرآن الكريم',
      'تعليم الصلاة والآداب الإسلامية للناشئة',
      'حلقات تجويد متخصصة للإناث'
    ],
    facilities: ['مسجد أثري بقباب عثمانية', 'قاعة تحفيظ هادئة', 'مكتبة تفسير الثعالبي'],
    photos: [
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    reviewsCount: 168,
    verified: true,
    registrationNumber: 'REG-DZ-16-1471-007',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - مَعْلم أثري وقفي 16/42',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الترتيل الجزائري والحفظ التلقيني للأشبال',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: false,
    reviews: [
      {
        id: 'rev-08',
        authorName: 'كريم العاصمي',
        userRole: 'parent',
        rating: 5,
        comment: 'ابني يتعلم هنا القرآن ومخارج الحروف مع تربية خلقية راقية.',
        date: '2026-06-11',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'الأحد إلى الخميس', dayFr: 'Dim - Jeu', timeSlot: '16:00 - 18:00', targetGroup: 'أطفال التعليم التحضيري والابتدائي', teacher: 'المقرئ الشيخ دراجي', subject: 'جزء عم وجزء تبارك والتلقين' }
    ]
  },
  {
    id: 'inst-08',
    name: 'المدرسة القرآنية الفلاح النموذجية ومسجد 1 نوفمبر 1954',
    type: 'quranic_school',
    wilayaCode: '05',
    wilayaNameAr: 'باتنة',
    commune: 'باتنة المركز',
    address: 'شارع الشهداء، حي المطار القديم، باتنة',
    lat: 35.5601,
    lng: 6.1820,
    foundedYear: 1982,
    historicalBio: 'تعد من أكبر المدارس القرآنية في منطقة الأوراس الأشم، تابعة لمركب مسجد أول نوفمبر العظيم، وتشتهر بتنظيم مسابقات ولائية سنوية وتفوق طلبتها في مسابقات حفظ القرآن الوطنية والدولية.',
    imamOrSheikh: 'الشيخ المقرئ سليم الأوراسي',
    studentCount: 1100,
    teachersCount: 42,
    capacity: 3200,
    phone: '+213 33 81 29 40',
    email: 'alfalah.quran@batna.dz',
    services: [
      'أقسام تحفيظ صباحية ومسائية تناسب جميع الفئات العمرية',
      'دورات إعداد المقرئين والحصول على سند الإجازة',
      'قسم خاص بتعليم القرآن الكريم لذوي الاحتياجات الخاصة والمكفوفين (طريقة برايل)',
      'مسابقات الحفظ السنوية مع جوائز تشجيعية كبرى'
    ],
    facilities: ['مركب تعليمي ضخم', 'قاعة برايل للمكفوفين', 'استوديو تسجيل صوتي للتلاوات', 'مصلى يتسع لـ 15000 مصل'],
    photos: [
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 310,
    verified: true,
    registrationNumber: 'REG-DZ-05-1982-008',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - اعتماد رقم 05/19',
    riwayaDefault: 'ورش عن نافع وحفص عن عاصم',
    quranicMethod: 'التقنيات التعليمية واستوديو التصحيح الصوتي وبرايل',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-09',
        authorName: 'نور الدين الشاوي',
        userRole: 'student',
        rating: 5,
        comment: 'مدرسة نموذجية بكل ما تعنيه الكلمة، أساتذة يجمعون بين العلم والرفق والتشجيع المستمر.',
        date: '2026-07-15',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'السبت، الإثنين، الأربعاء', dayFr: 'Sam, Lun, Mer', timeSlot: '17:30 - 20:00', targetGroup: 'طلبة التميز وحفظة النصف والكل', teacher: 'الشيخ سليم', subject: 'تصحيح الوقف والابتداء والمراجعة الحثيثة' }
    ]
  },
  {
    id: 'inst-09',
    name: 'زاوية سيدي الشيخ بمتليلي الشعانبة والأبيض سيدي الشيخ',
    type: 'zawiya',
    wilayaCode: '32',
    wilayaNameAr: 'البيض',
    commune: 'الأبيض سيدي الشيخ',
    address: 'وسط مدينة الأبيض سيدي الشيخ، ولاية البيض',
    lat: 32.8950,
    lng: 0.5480,
    foundedYear: 1600,
    historicalBio: 'معلم تاريخي وصوفي وروحي مصنف ضمن التراث العالمي، أسسه القطب سيدي عبد القادر بن محمد الملقب بـ "سيدي الشيخ". تمتاز الزاوية بتخريج حفظة القرآن عبر الألواح والضيافة الصحراوية العريقة والركب السنوي الشهير.',
    imamOrSheikh: 'شيوخ ومقدمو الطريقة الشيخية',
    studentCount: 560,
    teachersCount: 22,
    capacity: 2000,
    phone: '+213 49 71 80 05',
    email: 'zawiya.sidicheikh@elbayadh.dz',
    services: [
      'تحفيظ القرآن الكريم بالألواح والمداد التقليدي',
      'إيواء وتكفل شامل بالطلبة الوافدين من الجنوب والغرب',
      'دروس السيرة النبوية والموعظة الحسنة',
      'فعاليات ركب سيدي الشيخ السنوي الثقافي والديني'
    ],
    facilities: ['قبة تاريخية ومسجد الزاوية', 'دار الضيافة وإيواء الطلبة', 'مقر الركب السنوي'],
    photos: [
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewsCount: 175,
    verified: true,
    registrationNumber: 'REG-DZ-32-1600-009',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - وقف تراثي معتمد 32/03',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الألواح الخشبية والمداد الصمغي والترتيل المتوارث',
    hasBoarding: true,
    hasWomenClasses: false,
    hasWeekendClasses: true,
    hasIjazaProgram: false,
    reviews: [
      {
        id: 'rev-10',
        authorName: 'حمزة البيضي',
        userRole: 'visitor',
        rating: 5,
        comment: 'أصالة التراث الجزائري الصحراوي وطهارة الأرواح في رحاب القرآن.',
        date: '2026-05-19',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً طوال العام', dayFr: 'Quotidien', timeSlot: '06:00 - 18:00', targetGroup: 'طلبة الألواح المقيمون', teacher: 'الشيخ الطالب عبد القادر', subject: 'الحفظ والتسميع والسلكة الأسبوعية' }
    ]
  },
  {
    id: 'inst-10',
    name: 'مدرسة الإمام مالك القرآنية ومسجد العتيق بسطيف',
    type: 'quranic_school',
    wilayaCode: '19',
    wilayaNameAr: 'سطيف',
    commune: 'سطيف المركز',
    address: 'شارع 8 ماي 1945، وسط مدينة سطيف',
    lat: 36.1920,
    lng: 5.4150,
    foundedYear: 1974,
    historicalBio: 'من أقدم المدارس القرآنية الناشطة في عاصمة الهضاب العليا، عرفت بتنظيم مسابقات تحفيظ كبرى بالتعاون مع مديرية الشؤون الدينية، وتحتوي على حلقات مخصصة لكبار السن ومحو الأمية القرآنية.',
    imamOrSheikh: 'الشيخ الإمام بشير السطايفي',
    studentCount: 890,
    teachersCount: 35,
    capacity: 2200,
    phone: '+213 36 84 19 02',
    email: 'imammalik.quran@setif.dz',
    services: [
      'تعليم أحكام التجويد ومخارج الحروف للأطفال',
      'حلقات خاصة بالنساء في الفترات الصباحية',
      'برنامج مكثف للطلبة الجامعيين في العطل الأسبوعية',
      'مكتبة استعارة للكتب والشرائط التعليمية'
    ],
    facilities: ['قاعات تدريس مكيفة ومجهزة بشاشات ذكية', 'مصلى نساء مستقل', 'مكتبة إسلامية', 'قاعة وضوء حديثة'],
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewsCount: 220,
    verified: true,
    registrationNumber: 'REG-DZ-19-1974-010',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - ترخيص رسمي 19/67',
    riwayaDefault: 'ورش عن نافع وحفص عن عاصم',
    quranicMethod: 'التحفيظ الحديث والمصاحف المجودة والشاشات الذكية',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-11',
        authorName: 'أم مروة',
        userRole: 'parent',
        rating: 5,
        comment: 'معلمات فاضلات وحرص شديد على سلامة مخارج الحروف عند بناتنا.',
        date: '2026-06-04',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'السبت والثلاثاء', dayFr: 'Sam & Mar', timeSlot: '14:00 - 17:00', targetGroup: 'طالبات ونساء', teacher: 'الأستاذة مريم مجازة في ورش', subject: 'التجويد وحفظ سورة البقرة وآل عمران' }
    ]
  },
  {
    id: 'inst-11',
    name: 'زاوية سيدي محمد بلكبير القرآنية بأدرار',
    type: 'zawiya',
    wilayaCode: '01',
    wilayaNameAr: 'أدرار',
    commune: 'أدرار المدينة',
    address: 'حي الزاوية، مدينة أدرار، توات',
    lat: 27.8780,
    lng: -0.2910,
    foundedYear: 1949,
    historicalBio: 'من أعظم قلاع القرآن الكريم في الصحراء الكبرى وإفريقيا، أسسها الإمام المربي سيدي محمد بلكبير رحمه الله. تخرج منها عشرات الآلاف من الأئمة والمعلمين والدعاة الذين انتشروا في ربوع الجزائر والعالم، وما زالت منارة تشع نوراً وهداية.',
    imamOrSheikh: 'أبناء وتلاميذ سيدي محمد بلكبير',
    studentCount: 1400,
    teachersCount: 50,
    capacity: 4500,
    phone: '+213 49 96 10 20',
    email: 'zawiya.belkebir@adrar-quran.dz',
    services: [
      'الحفظ الكامل للقرآن الكريم برواية ورش عن نافع بالرسم العثماني والمغربي',
      'إيواء وتكفل كامل بمئات الطلبة من الصحراء والشمال والدول الإفريقية المجاورة',
      'تدريس الفقه المالكي ومختصر خليل ومتون التوحيد والنحو',
      'جلسات الذكر وقراءة السلكة القرآنية اليومية'
    ],
    facilities: ['مركب زاوية ضخم', 'عمارات إيواء الطلبة', 'مطاعم خيرية تعمل 24/7', 'مكتبة كبرى', 'مسجد تاريخي فسيح'],
    photos: [
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewsCount: 680,
    verified: true,
    registrationNumber: 'REG-DZ-01-1949-011',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - صرح وطني وقفي 01/01',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الألواح الخشبية الصلصالية والسلكة اليومية والضبط التواتري الشفوي',
    hasBoarding: true,
    hasWomenClasses: false,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-12',
        authorName: 'الشيخ عبد الرزاق التواتي',
        userRole: 'teacher',
        rating: 5,
        comment: 'مدرسة البركة والإخلاص، من دخل زاوية الشيخ بلكبير خرج منها حاملاً للقرآن عاملاً به.',
        date: '2026-08-01',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً على مدار 24 ساعة', dayFr: '24h/24', timeSlot: '04:30 - 22:30', targetGroup: 'طلبة القرآن المتفرغون', teacher: 'هيئة التدريس بالزاوية', subject: 'كتابة الألواح، المحو، الحفظ، ومجالس الإقراء' }
    ]
  },
  {
    id: 'inst-12',
    name: 'المدرسة القرآنية ومسجد سيدي بومدين الغوث بتلمسان',
    type: 'mosque',
    wilayaCode: '13',
    wilayaNameAr: 'تلمسان',
    commune: 'العباد - تلمسان',
    address: 'حي العباد الأثري، تلمسان',
    lat: 34.8720,
    lng: -1.3050,
    foundedYear: 1339,
    historicalBio: 'تحفة الفن المعماري الأندلسي الزياني المريني، شيدت بجوار ضريح الإمام سيدي بومدين شعيب الإشبيلي الغوث. تضم مدرسة قرآنية عريقة تخرج منها كبار أدباء وقراء حاضرة تلمسان.',
    imamOrSheikh: 'الشيخ الأستاذ مصطفى التلمساني',
    studentCount: 410,
    teachersCount: 19,
    capacity: 1500,
    phone: '+213 43 27 60 44',
    email: 'boumediene.quran@tlemcen.dz',
    services: [
      'تحفيظ القرآن الكريم مع الاهتمام بالأداء التلمساني الموريسكي العذب',
      'دروس في التصوف السني والحكم العطائية',
      'تعليم قواعد اللغة العربية ومخارج الحروف',
      'حلقات صيفية لأبناء الجالية الجزائرية بالخارج'
    ],
    facilities: ['مسجد ومدرسة أندلسية أثرية', 'قاعة تعليمية بفسيفساء زليج أندلسي', 'مكتبة تاريخية'],
    photos: [
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 190,
    verified: true,
    registrationNumber: 'REG-DZ-13-1339-012',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - قيد أثري وتاريخي رقم 89/13',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الترتيل الأندلسي العريق والألواح والكتب التراثية',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: false,
    reviews: [
      {
        id: 'rev-13',
        authorName: 'حميد الزياني',
        userRole: 'visitor',
        rating: 5,
        comment: 'روحانية لا تضاهى وزليج أندلسي ساحر يحيط بحلقات ذكر الله وترتيل آياته.',
        date: '2026-07-28',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'السبت إلى الأربعاء', dayFr: 'Sam - Mer', timeSlot: '16:30 - 19:00', targetGroup: 'حفظة القرآن الصغار والشباب', teacher: 'الشيخ مصطفى', subject: 'الترتيل وحفظ جزء عم وتبارك وقد سمع' }
    ]
  },
  {
    id: 'inst-13',
    name: 'المسجد العتيق عقبة بن نافع والمدرسة القرآنية بسيدي عقبة',
    type: 'mosque',
    wilayaCode: '07',
    wilayaNameAr: 'بسكرة',
    commune: 'سيدي عقبة',
    address: 'وسط مدينة سيدي عقبة، 18 كم شرق عاصمة الولاية بسكرة',
    lat: 34.7490,
    lng: 5.8980,
    foundedYear: 686,
    historicalBio: 'من أقدم المعالم والمساجد الإسلامية في شمال إفريقيا والجزائر، بُني في عهد الفتوحات الإسلامية عام 686م فوق ضريح الفاتح عقبة بن نافع الفهري. ظل عبر 14 قرناً مركزاً لتعليم القرآن الكريم وتخريج العلماء.',
    imamOrSheikh: 'الشيخ الإمام المعتمد محمد بن عمار السيدي',
    studentCount: 620,
    teachersCount: 26,
    capacity: 3500,
    phone: '+213 33 54 10 09',
    email: 'okba.mosque@biskra-quran.dz',
    services: [
      'تحفيظ القرآن الكريم وتلقين أحكام التجويد برواية ورش',
      'حلقات الإقراء وسند التلاوة المتصل',
      'دروس تاريخ الفتوحات والسيرة النبوية المطهرة',
      'زيارات علمية وتوثيقية للباحثين والطلبة'
    ],
    facilities: ['مسجد تاريخي أثري بنقوش إسلامية نادرة', 'مكتبة تاريخية', 'قاعات تدريس قرآنية', 'باحة استراحة فسيحة'],
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewsCount: 380,
    verified: true,
    registrationNumber: 'REG-DZ-07-0686-013',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - صرح تاريخي وطني رقم 07/01',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'التحفيظ المتواتر بالألواح والمصاحف العثمانية',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-14',
        authorName: 'عصام البسكري',
        userRole: 'visitor',
        rating: 5,
        comment: 'أقدم مسجد في الجزائر، عبق الفتوحات والقرآن يملأ جنبات هذا الصرح الخالد.',
        date: '2026-08-10',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً (صباحاً ومساءً)', dayFr: 'Tous les jours', timeSlot: '08:00 - 11:30 و 16:00 - 19:30', targetGroup: 'طلبة القرآن الكريم والناشئة', teacher: 'الشيخ محمد بن عمار', subject: 'الحفظ والتثبيت والقراءات' }
    ]
  },
  {
    id: 'inst-14',
    name: 'المدرسة القرآنية النموذجية الكوثر ومسجد الكوثر بالبليدة',
    type: 'quranic_school',
    wilayaCode: '09',
    wilayaNameAr: 'البليدة',
    commune: 'البليدة المركز',
    address: 'شارع فلسطين، ساحة التوت، وسط مدينة الورود البليدة',
    lat: 36.4702,
    lng: 2.8285,
    foundedYear: 1986,
    historicalBio: 'صرح قرآني وتربوي متميز في قلب مدينة البليدة، مشهور بتنظيم الدورات المكثفة لحفظ القرآن في العطل الصيفية والمخيمات القرآنية وحلقات التميز القرآني للفتيات والنساء.',
    imamOrSheikh: 'الشيخ الأستاذ فريد البليدي',
    studentCount: 1350,
    teachersCount: 52,
    capacity: 3800,
    phone: '+213 25 31 40 22',
    email: 'alkawthar.quran@blida.dz',
    services: [
      'دورات التحفيظ المكثف خلال العطلة الصيفية',
      'حلقات المقرأة الإلكترونية عن بعد والتصحيح الصوتي',
      'أقسام التعليم القرآني للطفولة المبكرة والتحضيري',
      'حلقات خاصة للمتقاعدين وكبار السن'
    ],
    facilities: ['مركب تعليمي من 4 طوابق', 'شاشات تفاعلية ذكية', 'قاعة برايل', 'مكتبة رقمية', 'مصلى فسيح'],
    photos: [
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 310,
    verified: true,
    registrationNumber: 'REG-DZ-09-1986-014',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - اعتماد رقم 09/314',
    riwayaDefault: 'ورش عن نافع وحفص عن عاصم',
    quranicMethod: 'التقنيات التعليمية التفاعلية والمخابر الصوتية والمصاحف',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-15',
        authorName: 'سارة بوجمعة',
        userRole: 'student',
        rating: 5,
        comment: 'أتممت حفظ 30 حزباً في مدرسة الكوثر بفضل الله ثم المتابعة الحثيثة من المعلمات.',
        date: '2026-07-30',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'الأحد إلى الخميس', dayFr: 'Dim - Jeu', timeSlot: '16:30 - 19:30', targetGroup: 'طلبة الأطوار التعليمية', teacher: 'هيئة التدريس بالكوثر', subject: 'القرآن والتجويد وأصول التلاوة' }
    ]
  },
  {
    id: 'inst-15',
    name: 'زاوية سيدي عبد الرحمن الورتيلاني والمدرسة القرآنية ببجاية',
    type: 'zawiya',
    wilayaCode: '06',
    wilayaNameAr: 'بجاية',
    commune: 'بني ورتيلان - بجاية',
    address: 'مرتفعات بني ورتيلان، ولاية بجاية',
    lat: 36.4250,
    lng: 4.9120,
    foundedYear: 1750,
    historicalBio: 'منارة العلم والجهاد في منطقة القبائل الصغرى وبجاية حاضرة العلم، أسسها العلامة الرحالة الفضيل الورتيلاني وسيدي عبد الرحمن. ظلت عبر القرون حصناً حصيناً لتعليم لغة القرآن والفقه المالكي وإيواء طلبة العلم من كافة أرجاء الجزائر.',
    imamOrSheikh: 'الشيخ الأستاذ عثمان الورتيلاني',
    studentCount: 480,
    teachersCount: 20,
    capacity: 1800,
    phone: '+213 34 88 12 00',
    email: 'zawiya.ourthilane@bejaia-quran.dz',
    services: [
      'تعليم القرآن الكريم بالألواح الخشبية والمداد الطبيعي',
      'إيواء وتكفل بالطلبة الداخليين الوافدين من مختلف الولايات',
      'تدريس اللغة العربية ومتون الأجرومية والرسالة الفقهية',
      'مهرجانات التكريم السنوية لحفظة كتاب الله'
    ],
    facilities: ['مركب الزاوية الجبلي', 'إقامة الطلاب الداخلية', 'مطعم وقاعة إطعام', 'مكتبة مخطوطات تاريخية'],
    photos: [
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 165,
    verified: true,
    registrationNumber: 'REG-DZ-06-1750-015',
    registrationStatus: 'historical_heritage',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - وقف قرآني مسجل 06/18',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'اللوح الخشبي والدواة والصلصال والتسميع الشفوي',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-16',
        authorName: 'أرزقي القبائلي',
        userRole: 'student',
        rating: 5,
        comment: 'أجواء إيمانية في قمم الجبال، حفظ القرآن هنا له طعم خاص وروحانية عظيمة.',
        date: '2026-06-18',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً على مدار الأسبوع', dayFr: '7j/7', timeSlot: '05:00 - 20:30', targetGroup: 'طلبة القرآن الداخليون والزوار', teacher: 'الشيخ عثمان ومشايخ الإقراء', subject: 'كتابة الألواح والسلكة اليومية' }
    ]
  },
  {
    id: 'inst-16',
    name: 'المدرسة القرآنية ومسجد أبي ذر الغفاري بعنابة',
    type: 'mosque',
    wilayaCode: '23',
    wilayaNameAr: 'عنابة',
    commune: 'عنابة المركز - الكورنيش',
    address: 'شارع ابن خلدون، بالقرب من شاطئ ريزي عمر، عنابة',
    lat: 36.9010,
    lng: 7.7650,
    foundedYear: 1992,
    historicalBio: 'من أنشط المؤسسات القرآنية في الشرق الجزائري وعروس الساحل عنابة، تتميز بمقرأة نموذجية لحفظ وتجويد القرآن الكريم وبرامج متخصصة للطلبة الجامعيين وإجازات التلاوة بسند الشاطبية والدرة.',
    imamOrSheikh: 'الشيخ المقرئ سليم العنابي',
    studentCount: 780,
    teachersCount: 30,
    capacity: 2200,
    phone: '+213 38 86 50 11',
    email: 'aboudhar.quran@annaba.dz',
    services: [
      'حلقات الإقراء والإجازة بالسند المتصل',
      'تعليم القرآن الكريم وأحكام الترتيل للأطفال',
      'حلقات مكثفة للطلبة الجامعيين والمهندسين والأطباء',
      'مسابقات دورية في حسن الصوت والأداء القرآني'
    ],
    facilities: ['قاعات تدريس مجهزة بأجهزة صوتية متطورة', 'مكتبة قرآنية متخصصة', 'مصلى فسيح', 'قاعة اجتماعات ومحاضرات'],
    photos: [
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewsCount: 205,
    verified: true,
    registrationNumber: 'REG-DZ-23-1992-016',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - ترخيص رقم 23/88',
    riwayaDefault: 'ورش عن نافع وحفص عن عاصم',
    quranicMethod: 'المقارئ الحديثة، الصوتيات المتخصصة، والإجازات بالسند',
    hasBoarding: false,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: true,
    reviews: [
      {
        id: 'rev-17',
        authorName: 'طارق بن ناصر',
        userRole: 'student',
        rating: 5,
        comment: 'حلقات إقراء على مستوى عالٍ جداً من الضبط والإتقان والتوجيه الأكاديمي.',
        date: '2026-07-22',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'السبت والإثنين والأربعاء', dayFr: 'Sam, Lun, Mer', timeSlot: '17:00 - 20:00', targetGroup: 'طلبة الإجازة والمستوى المتقدم', teacher: 'الشيخ سليم العنابي', subject: 'قراءة الختمة وضبط الوجوه القرائية' }
    ]
  },
  {
    id: 'inst-17',
    name: 'المدرسة القرآنية المركزية بتمنراست وأهقار',
    type: 'quranic_school',
    wilayaCode: '11',
    wilayaNameAr: 'تمنراست',
    commune: 'تمنراست المدينة',
    address: 'حي أنكوف، وسط مدينة تمنراست، أهقار',
    lat: 22.7850,
    lng: 5.5220,
    foundedYear: 1980,
    historicalBio: 'منارة الهداية والقرآن في أقصى الجنوب الجزائري وجبال الأهقار الشامخة، تستقطب أبناء الصحراء الكبرى لحفظ كتاب الله وإتقان ترتيله، وتساهم بفعالية في تعزيز الهوية الوطنية والإسلامية الأصيلة.',
    imamOrSheikh: 'الشيخ الإمام أمود التارقي وشيوخ الأهقار',
    studentCount: 540,
    teachersCount: 22,
    capacity: 1600,
    phone: '+213 29 34 18 90',
    email: 'hoggar.quran@tamanrasset.dz',
    services: [
      'تحفيظ القرآن الكريم برواية ورش عن نافع باللوح والمصحف',
      'حلقات محو الأمية وتعليم مبادئ الشريعة والتفسير',
      'قوافل قرآنية إلى القرى والواحات الصحراوية المجاورة',
      'توزيع المصاحف والألواح والكتب التعليمية مجاناً'
    ],
    facilities: ['مركب قرآني بمواصفات صحراوية تراثية مكيفة', 'إقامة طلابية', 'مكتبة إسلامية', 'فناء مظلل'],
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewsCount: 145,
    verified: true,
    registrationNumber: 'REG-DZ-11-1980-017',
    registrationStatus: 'registered_ministry',
    ministryLicenceNumber: 'وزارة الشؤون الدينية والأوقاف - قرار اعتماد 11/104',
    riwayaDefault: 'ورش عن نافع من طريق الأزرق',
    quranicMethod: 'الجمع بين أصالة اللوح الخشبي والمصاحف المجودة',
    hasBoarding: true,
    hasWomenClasses: true,
    hasWeekendClasses: true,
    hasIjazaProgram: false,
    reviews: [
      {
        id: 'rev-18',
        authorName: 'بشير الأهقاري',
        userRole: 'visitor',
        rating: 5,
        comment: 'صوت القرآن يصدح في صحراء الجزائر الطاهرة ببركة هؤلاء المشايخ والطلبة النجباء.',
        date: '2026-05-08',
        verifiedVisitor: true
      }
    ],
    schedules: [
      { dayAr: 'يومياً ما عدا الجمعة', dayFr: 'Tous les jours sauf Ven', timeSlot: '07:00 - 11:30 و 16:30 - 19:30', targetGroup: 'ناشئة وشباب الأهقار', teacher: 'الشيخ أمود ومقرئو تمنراست', subject: 'الحفظ والتلقين والتجويد' }
    ]
  }
];
