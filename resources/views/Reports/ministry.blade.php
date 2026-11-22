<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <title>نظام طباعة بيانات الجواز المصري</title>
    <style>
        :root {
            --primary: #1a73e8;
            --bg: #f8f9fa;
        }

        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: var(--bg);
            padding: 20px;
            margin: 0;
        }

        /* منطقة التحكم - تختفي عند الطباعة */
        #control-panel {
            background: #fff3cd;
            border: 2px solid #ffeeba;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .input-group {
            display: inline-block;
            margin-left: 20px;
            margin-bottom: 10px;
        }

        .input-group label {
            display: block;
            font-size: 13px;
            color: #856404;
            font-weight: bold;
        }

        .input-group input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            width: 250px;
            outline: none;
        }

        .input-group input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 5px rgba(26, 115, 232, 0.2);
        }

        .btn-print {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
        }

        /* تنسيق الأماكن التي سيوضع فيها النص في نموذجك */
        .sync-name,
        .sync-id,
        .sync-pass {
            font-weight: bold;
            color: #000;
        }

        /* تنسيق الطباعة */
        @media print {

            #control-panel,
            .no-print {
                display: none !important;
            }

            body {
                background: white;
                padding: 0;
            }

            /* تأكد من أن الحقول تظهر كنص عادي تماماً */
            .sync-name,
            .sync-id,
            .sync-pass {
                color: black !important;
            }
        }
    </style>
</head>

<body>

    {{-- <div id="control-panel" class="no-print">
        <h3 style="margin-top:0; color:#856404;">مركز التعديل قبل الطباعة</h3>

        <div class="input-group">
            <label>الاسم بالكامل:</label>
            <input type="text" id="master-name" placeholder="سيتم تعبئته تلقائياً...">
        </div>

        <div class="input-group">
            <label>الرقم القومي (14 رقم):</label>
            <input type="text" id="master-id" maxlength="14" placeholder="أكمل الـ 14 رقماً...">
        </div>

        <div class="input-group">
            <label>رقم جواز السفر:</label>
            <input type="text" id="passport_display" placeholder="رقم الجواز...">
        </div>

        <button class="btn-print" onclick="window.print()">إعتماد وطباعة النهائي</button>
    </div> --}}

    <div>
        <style>
            .signatures {
                display: flex;
                justify-content: space-between;
                flex-direction: row-reverse;
                margin-top: 40px;
            }

            .party {
                width: 45%;
                font-size: 14px;
            }

            .party-title {
                text-align: center;
                font-weight: bold;
                margin-bottom: 30px;
            }

            .field {
                display: flex;
                align-items: center;
                margin-bottom: 18px;
            }

            .label {
                width: 70px;
                white-space: nowrap;
            }

            .line {
                flex: 1;
                border-bottom: 1px solid #000;
                height: 20px;
                margin-right: 10px;
                position: relative;
            }

            .line::before {
                content: ":";
                position: absolute;
                right: -10px;
                /* مكان النقطتين */
                top: -2px;
                font-weight: bold;
            }

            .value {
                flex: 1;
                border-bottom: 1px solid #000;
                height: 20px;
                margin-right: 10px;
                padding-right: 5px;
            }

            .fingerprint-box {
                width: 120px;
                height: 150px;
                border: 1px solid #000;
                margin: 10px auto 0;
            }
        </style>

        <div class="client">
            <div class="page">
                <div class="header" style="position: relative;">
                    <span style="position: absolute; left: 50%;top: -22px;">
                    </span>
                    <h1 style="font-size: 18px;">عقد عمل موسمي لمهنة سائق حافلة مستقدم</h1>
                    <h1 style="font-size: 18px;">من خارج المملكة العربية السعودية غير مصرح له بالحج (موسم حج 1448هـ)
                    </h1>
                </div>

                <div class="date-line" style="text-align: center; font-weight: bold; margin-top: 20px;">
                    إنـه في يوم <span id="current-day"></span> وبتاريخ <span id="current-date"></span> تـم الاتفاق
                    والتراضي بين كل من:
                </div>

                <script>
                    const today = new Date();

                    // مصفوفة أسماء الأيام باللغة العربية
                    const arabicDays = [
                        "الأحد",
                        "الاثنين",
                        "الثلاثاء",
                        "الأربعاء",
                        "الخميس",
                        "الجمعة",
                        "السبت"
                    ];

                    // استخراج اسم اليوم
                    const dayName = arabicDays[today.getDay()];

                    // تنسيق التاريخ بصيغة YYYY/MM/DD
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const formattedDate = `${year}/${month}/${day}`;

                    // وضع القيم داخل عناصر HTML
                    document.getElementById("current-day").textContent = dayName;
                    document.getElementById("current-date").textContent = formattedDate;
                </script>

                <table class="boldTD" style="margin: 10px 0;">
                    <tr>
                        <td class="party-cell">الطـــــــرف الأول</td>
                    </tr>
                    <tr>
                        <td class="label-cell">منشـــأة النقل</td>
                        <td class="value-cell">شركة البركة الدولية التجارية</td>
                    </tr>
                    <tr>
                        <td class="label-cell">يمثلها في هذا العقد</td>
                        <td class="value-cell">أحمد عبد الرحمن كريشان</td>
                    </tr>
                    <tr>
                        <td class="label-cell">بصـــــفتــــــــه</td>
                        <td class="value-cell">مدير الجهة</td>
                    </tr>
                </table>

                <table class="boldTD" style="margin-bottom: 10px ;">
                    <tr>
                        <td class="party-cell">الطـــــــرف الثاني</td>
                    </tr>
                    <tr>
                        <td class="label-cell">طالب العمل السيد</td>
                        <td class="value-cell" colspan="5">
                            <span class="sync-name">{{ $client->name_ar }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="label-cell">الجـــنســــيـــــــة</td>
                        <td class="value-cell">مصر</td>
                        <td class="label-cell">رقم الهوية</td>
                        <td class="value-cell" colspan="3">
                            <span class="sync-id">{{ $client->national_id }}</span>
                        </td>

                    </tr>
                    <tr>
                        <td class="label-cell">رقم جـــواز الســــفر</td>
                        <td class="value-cell">
                            <span class="sync-pass">{{ $client->passport_number }}</span>
                        </td>
                        <td class="label-cell">الصادر من</td>
                        <td class="value-cell">مصر</td>
                        <td style="width: 10%; font-weight: bold;">بتاريخ</td>
                        <td class="value-cell">-</td>
                    </tr>
                    <tr>
                        <td class="label-cell full-width">العنــــــــوان</td>
                        <td class="label-cell full-width" colspan="5"></td>
                    </tr>
                </table>

                <div class="content-text" style="margin-bottom: 5px;">
                    <strong class="underline-text">بعد ان اقر كل منهما بأهليته المعتبرة شرعا دون إجبار أو اكراه تم
                        الاتفاق على ما
                        يلي:</strong>
                </div>

                <div class="content-text" style="margin-bottom: 10px;font-weight: bold;"><strong>أولاً:</strong> كل
                    اقرار او ملحق
                    موقع من قبل الطرفين
                    يعتبر جزءا لا يتجزأ من هذا
                    العقد.<br>
                    ثانيا: يعمل الطرف الثاني لدي الطرف الأول وتحت إشرافه بمهنة سائق حافلة أيا كان عدد ركابها أو سعتها في
                    أي مدينة من
                    مدن المملكة العربية السعودية وان </div>
                <div class="content-text" style="margin-bottom: 10px;font-weight: bold;"> <strong
                        class="underline-text">ثالثاً
                        مدة
                        هذا
                        العقد:</strong><br>
                    مده هذا العقد موسم عمره/ حج 1448هـ علي ان تبدأ من تاريخ وصول الطرف الثاني إلى المملكة العربية
                    السعودية واستلامه
                    العمل ومباشرته وذلك لموسم الحج
                    (1448هـ) وعلى الطرف الثاني الحضور في الموعد المحدد لاستلام العمل وفي حالة تخلفه عن الحضور يعتبر
                    العقد مفسوخا من
                    جانبه ولا يحق له المطالبة بأي تعويض كما أنه لا يحق له الامتناع عن العمل أو طلب الرجوع إلى بلده قبل
                    انتهاء الموسم
                    إلا بموافقة الطرف الأول.
                </div>

                <div class="content-text"><strong class="underline-text">رابعا: الاجر:</strong></div>
                <div class="clause" style="font-weight: bold;">يتقاضى الطرف الثاني من الطرف الاول راتباً قدره (1500) ألف
                    وخمسمائة
                    ريال شهريا شامل الاعاشة يصرف
                    له عند تصفية مستحقاته لنهاية المدة بعد حسم السلف والجزاءات إن وجدت عدد ساعات العمل هي (12) ساعة
                    يوميا) طيلة أيام
                    الأسبوع. <br> تصرف للطرف الثاني الحوافز طبقا للجدول المرفق .</div>

                <style>
                    .salary-table {
                        table-layout: fixed;
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .salary-table td:first-child {
                        width: 45px;
                        text-align: center;
                        vertical-align: middle;
                        white-space: nowrap;
                        font-weight: bold;
                    }

                    .salary-table td:last-child {
                        text-align: start !important;
                    }

                    .salary-table td {
                        border: 1px solid #1340de91;
                        color: #4139ce;
                        font-weight: bold;
                        font-size: 12px;
                        padding: 2px 1px;
                    }
                </style>


                <table class="salary-table" style="margin: 10px 0;table-layout: fixed;width: 100%;">
                    <colgroup>
                        <col style="width: 5px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tr>
                        <td colspan="2" class="table-header"
                            style='text-align: center !important; font-size: 14px !important;'>جدول
                            الحـوافـز</td>
                    </tr>
                    <tr>
                        <td class="label-cell" style="font-size:12px;">المبلغ بالريال</td>
                        <td class="label-cell" style='text-align: center !important; font-size:12px;'>اتجاه الرحلة</td>
                    </tr>
                    <tr>
                        <td class="num-cell">400</td>
                        <td>مكافأة رحلة التصعيد للرحلات الترددية أو الرحلات العادية بنظام الدين أو الرحلات بالحافلات
                            المكشوفة أو
                            الحافلات المكيفة</td>
                    </tr>
                    <tr>
                        <td>200</td>
                        <td>مكافأة رحلة التصعيد (أ) في حالة استلام الحافلة وبقاء السائق احتياطيا ولم يعمل</td>
                    </tr>
                    <tr>
                        <td>200</td>
                        <td>مكافأة رحلة التصعيد (ب) في حالة عدم استلام حافلة وبقي السائق احتياطيا في عرفات</td>
                    </tr>
                    <tr>
                        <td>200</td>
                        <td>مكافأة رحلة التصعيد في الترددية للسائق الواحد إذا كانت تعمل بعدد (2) سائق</td>
                    </tr>
                    <tr>
                        <td>60</td>
                        <td>من المدينة المنورة إلى مكة المكرمة بالحافلة المكشوفة</td>
                    </tr>
                    <tr>
                        <td>30</td>
                        <td>من مكة المكرمة أو جدة إلى المدينة المنورة أو العكس بالحافلة</td>
                    </tr>
                    <tr>
                        <td>30</td>
                        <td>مكافأة لسائق الحافلة اقل من 25 راكب من جدة أو مكة المكرمة إلى المدينة المنورة أو العكس</td>
                    </tr>
                    <tr>
                        <td>50</td>
                        <td>من جدة إلى الجحفة فمكة المكرمة بالحافلة المكشوفة</td>
                    </tr>
                    <tr>
                        <td>40</td>
                        <td>من جدة إلى الجحفة فمكة المكرمة بالحافلة المغطاة</td>
                    </tr>
                    <tr>
                        <td>15</td>
                        <td>من جدة إلى مكة المكرمة والعكس بالحافلة</td>
                    </tr>
                    <tr>
                        <td>15</td>
                        <td>مكافأة يومية للسائقين الموسميين المرابطين في الطرق السريعة</td>
                    </tr>
                    <tr>
                        <td>%50</td>
                        <td>يحتسب الرد الخالي بنصف قيمة مكافأة الرحلة في إي اتجاه بشرط التزام السائق بالمدة المقررة
                            للرحلة</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>مكافأة مرابطة الموسميين للفنيين على الطرق السريعة يوميا</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>مكافأة الرحلة من مطار المدينة المنورة - إلى المدينة المنورة والعكس</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>مكافأة خدمة الصلوات</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>مزارات مكة المكرمة والمدينة المنورة</td>
                    </tr>
                </table>

            </div>

            <div class="page" style="margin-top: 20px;">
                <style>
                    ol {
                        padding-right: 20px;
                        margin: 5px 0 0;
                    }

                    ol li {
                        font-size: 13px;
                        line-height: 1.3;
                        list-style: none;
                        font-weight: bold;
                    }
                </style>
                <h3 class="underline-text" style="width: fit-content; margin-top: 10px; ">خامساً: واجبات والتزامات الطرف
                    الثاني:
                </h3>
                <ol>
                    <li>1) يجب على الطرف الثاني احترام انظمة واعراف المملكة وأوامر وتوجيهات الطرف الأول ورؤسائه
                        المباشرين بالشركة
                        وإنفاذها دون تهاون أو تأخير كما يلتزم بالحرص على أوقات العمل وعدم التأخر أو الغياب</li>
                    <li>2) يقر الطرف الثاني بأنه قد افهم لمضمون المواد (65) من نظام العمل وانه ملتزم بكل ما ورد في تلك
                        المواد.</li>
                    <li>3) يلتزم الطرف الثاني بارتداء زي المنشأة ووضع بطاقة التعريف على صدره كما يلتزم بالمحافظة على
                        المركبة المسلمة
                        له والبقاء بجوارها بصفة دائمة في جميع الرحلات وخاصة أيام التصعيد وعدم اركاب الحجاج على أسطح
                        حافلة او تحميلها
                        بأكثر من حمولتها ويتحمل نتيجة مخالفته لذلك.</li>
                    <li>4) يلتزم الطرف الثاني بأتباع تعليمات السير على الطرق وفق نظام المرور ويتعهد بالمحافظة على قواعد
                        الأمن
                        السلامة
                        في السير على الطرق وكذلك المحافظة على المركبة التي يقودها وعدم تحميلها بأكثر من حمولتها وعدم
                        العبث بمحتوياتها
                        ومستنداتها ويتحمل وحده العقوبات التي تصدر من الجهات المختصة بخصوص مخالفته لذلك وكل ما يترتب على
                        تلك المخالفة
                        من
                        اضرار.</li>

                    <li>5) على الطرف الثاني الوقوف بالحافلة في مراكز الاستقبال في مداخل المدن وفي مراكز التفويج عند
                        خروجه من المدن
                        ومكاتب الشركة المقامة في المراكز لختم جدول رحلته والتوجه الى المكان المخصص لركاب مركبته وايصال
                        الحجاج الى
                        اماكن
                        سكنهم وتسليم جوازات سفرهم للمكاتب المختصة والتأكد من أن جميع الركاب قد استلموا امتعتهم قبل
                        مغادرتهم المركبة
                        وفي
                        حال مخالفته لذلك يحرم من مكافأة الرحلة ويتحمل أي عقوبة تقع عليه من
                        قبل الجهات المختصة.</li>
                    <li>6) يلتزم الطرف الثاني بالمحافظة على جوازات الركاب ووضعها داخل الصندوق المخصص الموجود في المركبة
                        بعد التأكد
                        من
                        مطابقة الجوازات على الركاب عند بدأ الرحلة وعدم تسليم الجوازات لأصحابها وتسليمها الى المختصين
                        واحد ما يثبت
                        تسليمها.
                    </li>
                    <li>7) يجب على الطرف الثاني التوجه بالحافلة الى المكان المتواجد فيه الحجاج ونقلهم الى المكان المحدد
                        من قبل قسم
                        الحركة بالشركة والتأكد أن جميع الركاب قد استلموا امتعتهم قبل مغادرتهم المركبة وفي حالة مخالفته
                        للرحلة يتحمل أي
                        عقوبة تقع عليه من قبل الجهات المختصة.</li>
                    <li>8) يلتزم الطرف الثاني في معاملة الركاب باحترام وتقديم جميع وسائل الراحة لهم والوقوف بهم في أوقات
                        الصلاة في
                        الاماكن المناسبة ليؤدوا الصلاة في وقتها كما يجب عليه التوقف عند مواقيت الاحرام لتمكين الركاب من
                        الاحرام كما
                        يلتزم بعدم مطالبتهم بأية مبالغ مالية تحت أي مسمي وفي حالة مخالفته سيطبق بحقه ما تقضي به اللوائح
                        الصادرة من
                        الجهات المختصة والشركة.</li>

                </ol>

                <h3 class="underline-text" style="width: fit-content;margin-top: 10px;">سادساً:حقوق الطرف الثاني:</h3>
                <ol>
                    <li>1) يحق للطرف الثاني السكن بالمساكن الخاصة بالطرف الأول المعدة للعاملين بالشركة ومراكزها في كل
                        مدينة يوجد بها
                        سكن دون مقابل ، علي أن يكون السكن لائق ومناسب وان يلتزم الطرف الثاني بتعليمات السكن المقررة من
                        قبل الشركة.
                    </li>
                    <li>2) يحق للطرف الثاني الحصول على تذكرة عودة الى بلاده حسب سياسة النقل الدولي فيما يخص الأمتعة وقت
                        مغادرته ،
                        وما
                        زاد على ذلك ينقل بواسطته وبمعرفته وعلى حسابه.</li>
                    <li>3) يحق للطرف الثاني الحصول على شهادة خبرة من الطرف الأول حسبما نص عليه نظام العمل. </li>
                    <li>4) يحق للطرف الثاني الحصول
                        على الرعاية الصحية بالإضافة إلى تقديم تامين طبي حال تعرضه إلى إصابة من إصابات العمل</li>
                </ol>

                <h3 class="underline-text" style="width: fit-content;margin-top: 10px;">سابعاً: واجبات والتزامات الطرف
                    الاول:</h3>
                <ol>
                    <li>يلتزم الطرف الأول بواجبات اصحاب العمل المنصوص عليها من نظام العمل السعودي. وان الراتب الذي
                        يتقاضاه شامل
                        الاعاشة</li>
                </ol>

                <h3 class="underline-text" style="width: fit-content;margin-top: 10px;">ثامناً: حقوق الطرف الأول:</h3>
                <ol>
                    <li>1) يحق للطرف الأول فسخ هذا العقد في حالة ارتكاب الطرف الثاني لأي من المخالفات المنصوص عليها في
                        المادة (80)
                        من
                        نظام العمل السعودي.</li>
                </ol>

                <h3 class="underline-text" style="width: fit-content;margin-top: 10px;">تاسعاً: أحكام عامة:</h3>
                <ol>
                    <li>1) يحظر على الطرف الثاني الامتناع عن اداء العمل مهما كانت الظروف وعليه اداء عمله على الوجه
                        المطلوب حتى لا
                        يتعرض الى المؤاخذة والمسائلة حسب ما نص عليه نظام العمل والعمال السعودي.</li>
                    <li>2) في حال رغب الطرف الثاني إنهاء العقد قبل انتهاء مدته فيحق للطرف الأول تحميل الطرف الثاني جميع
                        ما صرفه من
                        رسوم تأشيرة و تذكرة سفر على أن يغادر على حسابه.</li>
                    <li>3) يحظر على الطرف الثاني الاساءة لرؤسائه وزملائه والركاب بالألفاظ غير اللائقة كما يحظر عليه
                        إزعاج الركاب
                        بالموسيقي والاغاني او تدخين السجائر في المركبة او اخذ اي مبالغ مالية تحت أي مسمي وفي حالة
                        مخالفته ذلك ستطبق
                        عليه
                        اشد العقوبات.</li>
                    <li>4) يحظر على الطرف الثاني العمل لدي الغير طيلة فترة هذا العقد.</li>
                    <li>5) يحظر على الطرف الثاني الاحرام اثناء موسم الحج أو العمرة داخل المملكة العربية السعودية أو
                        اثناء قدومه
                        اليها
                        عبر المنافذ المختلفة وكذلك عدم أداء الشعائر الدينية (الحج) وإذا خالف ذلك يحرم من الاكرامية
                        ويتحمل تبعاة ذلك
                        امام
                        الجهات ذات العلاقة ومعاقبته بالعقوبة المناسبة.</li>
                    <li>6) من قرار مجلس الوزراء المشار اليه في العقوبات فإن العقوبات التي تطبق على السائقين الذين يثبت
                        عدم قيامهم
                        بنقل
                        الحجاج دون عذر مشروع هي كما يلي:
                        <ul style="margin-right: 40px;">
                            <li>- غرامة مالية تساوي تكاليف نقل الحجاج الذين لم ينقلهم ويشترك في دفع هذه الغرامة كل من
                                تثبت مسؤوليته في
                                عدم
                                نقلهم سواء كانت شركة نقل مؤسسة طوافة او مرشدا او مراقبا او غير ذلك كل حسب مسؤوليته في
                                هذه المخالفة.</li>
                            <li> -الغاء عقد هو حرمانه من المكافأة المقرر له في العقد المبرم وحجز المبالغ التي يستحقها
                                الى حين استيفاء
                                الغرامة.</li>
                            <li>- حظر التعاقد معه مستقبلا من قبل شركات نقل الحجاج أو مؤسسات الطوافة ونحوها.</li>
                            <li>- ترحيل السائق غير السعودي بعد استيفاء العقوبة ومنع استقدامه مستقبلا.</li>
                        </ul>
                    </li>

                    <li>7) يحظر على الطرف الثاني الهروب بالمركبة أو تأجيرها لحسابه الخاص أو عدم الوفاء بالرحلات المطلوبة
                        والمبلغة له
                        من المسئولين وفي حالة قيامه بذلك تطبق عليه ما تقضي به الانظمة والقرارات الصادرة من الجهات
                        المختصة وللشركة</li>
                    <li>8) يتحمل الطرف الثاني ما يترتب عليه نحو الحق العام والخاص نتيجة ما قد يقع من حوادث أو مخالفات
                        تسبب فيها
                        أثناء
                        قيادته للمركبة وذلك مع عدم الإخلال بأحقية الطرف الأول من مطالبته بالتعويض عن الخسائر التي تلحق
                        بالمركبة من
                        جراء
                        ذلك وحسم التلفيات والاضرار من مستحقات الطرف الثاني لدي الشركة</li>
                    <li>9) يحضر على الطرف الثاني الاعتصام مع مجموعة من الاشخاص بعرض تعطيل العمل واثارة الشغب لأي سبب
                    </li>
                    <li>10) يلتزم الطرف الثاني بالإقرار والتعهد الملحق بالعقد بجميع بنودها او أي تعليمات طارئة اثناء
                        التشغيل</li>
                    <li>11) لا يحق لأي من طرفي العقد الادعاء بجهل أو عدم معرفة كل أو بعض ما ذكر في هذا العقد وملحقاته
                        ويعتبر كل
                        منهما
                        قد عرف معرفة تامة مضمون
                        العقد ملحقاته بمجرد التوقيع عليه من قبل الطرفين</li>
                </ol>
            </div>

            <div class="page" style="margin-top: 20px;min-height: 297mm;">
                <ol>
                    <li>12) أي خلاف ينشأ بين طرفي العقد لا سمح الله بخصوص بنود ومرفقات هذا يحل بالطرق الودية وإذا لم
                        تفلح فيحل بأنظمة
                        العمل والعمال الذي فيه مقر
                        المنشأة وخلاف ذلك ففي الجهة المختصة حسب الظلمة المملكة العربية السعودية.</li>
                    <li>13) يعتبر هذا العقد ملزما للطرفين حال التوقيع وعليه ولا يحق لأي منهما الرجوع عنه.</li>
                    <li>14) حرر هذا العقد من نسختين
                        بيد كل طرف نسخة للعمل بموجبها.</li>
                </ol>
                <h1 style="text-align: center; margin-top: 50px;">والله ولي التوفيق ,,</h1>

                <div class="signatures">

                    <div class="party">
                        <div class="party-title">الطرف الأول</div>

                        <div class="field">
                            <div class="label">الاسم</div>
                            <div class="line">أحمد عبد الرحمن كريشان</div>
                        </div>

                        <div class="field">
                            <div class="label">التوقيع</div>
                            <div class="line"></div>
                        </div>
                    </div>

                    <div class="party">
                        <div class="party-title">الطرف الثاني</div>

                        <div class="field">
                            <div class="label">الاسم</div>
                            <div class="line">
                                <div class="value"><span class="sync-name"> {{ $client->name_ar }} </span>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <div class="label">التاريخ</div>
                            <div class="line">

                                <div class="value date"></div>



                            </div>

                        </div>
                        <div class="field">
                            <div class="label">التوقيع</div>
                            <div class="line">

                                <div class="value"></div>
                            </div>

                        </div>

                        <div class="field">
                            <div class="label">البصمة</div>
                        </div>

                        <div class="fingerprint-box"></div>
                    </div>

                </div>
            </div>

            <div class="page" style="margin-top: 20px;min-height: 297mm;">
                <h1 style="text-align: center;margin-bottom: 30px;">لائحة الجزاءات المحددة بمحضر هيئة النقابة رقم (11)
                    وتاريخ
                    1448هـ
                </h1>
                <style>
                    .ssss th,
                    .ssss td {
                        border: 1px solid #3e45d3;
                        color: #191294;
                        font-size: 15px;
                        font-weight: bold;
                        text-align: right !important;
                    }

                    table td:first-child {
                        text-align: center !important;
                    }

                    p {
                        margin-top: 30px;
                        font-size: 13px;
                        line-height: 1.5;
                        font-weight: bold;
                    }
                </style>
                <table class="ssss">
                    <tr>
                        <th style="text-align: center !important ; font-size: 16px;">م</th>
                        <th style="text-align: center !important ; font-size: 16px;">المخالفة</th>
                        <th style="text-align: center !important; font-size: 16px;">العقوبات</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>الامتناع عن العمل وطلب العامل الوجوه إلى البلد قبل انتهاء الموسم</td>
                        <td>خصم تكاليف الاستقدام + السفر بدون مستحقات</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>عدم التواجد في مقر العمل (اذا تكررت المخالفة تتضاعف العقوبة)</td>
                        <td>حسم يوم الغياب حق تصل إلى السفر بدون حقوق</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>الانسحاب من العمل قبل رحلة المشاعر المقدسة (أيام التصعيد)</td>
                        <td>خصم تكاليف الاستقدام + السفر بدون مستحقات</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>الهروب من المطوف (تعتبر الغرامة المرجعة هي الحد الأدنى)</td>
                        <td>10,000 ريال</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>المخالفات المرورية التي يرتكبها السائق أثناء موسم الحج</td>
                        <td>حسب قيمة المخالفة</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>الغرامة الصادرة من البلدية أو الجهات ذات العلاقة لرمي المخلفات والأوساخ من الحافلة في غير
                            الأماكن المخصصة
                            لها</td>
                        <td>حسب قيمة المخالفة</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>التأخير في العودة من تنفيذ أي رحلة تم تكليف السائق بها</td>
                        <td>(حسم مدة التأخير + عقوبة وإذا تكررت المخالفة يتضاعف الخصم والعقوبة)</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>إذا حصلت تلفيات بالحافلة لا سبب الله الناتجة عن خطأ السائق</td>
                        <td>حسم التلفيات حسب تقييم إدارة المعارض</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>عدم المحافظة على ممتلكات الشركة</td>
                        <td>حسم أجرة يوم ويتضاعف إذا تكررت المخالفة</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>ثبوت تعاطي المخدرات بعد الفحص من قبل الجهات المختصة</td>
                        <td>السفر بدون حقوق</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>أحداث شغب أو أي مشاكل أثناء الموسم</td>
                        <td>السفر بدون حقوق</td>
                    </tr>
                    <tr>
                        <td colspan="3">وفي حالة استثناء، حقوق الطرف الثاني لقيمة الغرامات المفروضة عليه، يحق للطرف
                            الأول مقاضاته
                            ومطالبته بالمبالغ المستحقة عليه أو بلده</td>
                    </tr>
                </table>
                <p>
                    اقر بأنه يجب على الفور الانتهاء من تنفيذ رحلة المشاعر المقدسة 1448/12/13هـ وأن أحضر نفسي يوميا لدي
                    مكاتب علاقات
                    السائقين واثبات ذلك بإفادة خطية على حفيظة الحافلة مختومة بختم علاقات السائقين وذلك في حال عدم خروجي
                    العمل
                    والبقاء
                    داخل الشركة بالشميسي وفي حال عدم حصولي على ما يثبت بقائي في موقع الشركة بالشميسي فأنه ليس لي الحق
                    بمطالبة راتب
                    هذه
                    الفترة. اقر بأنني اعلم بأن الشركة ستقوم بتحديد مدة لتنفيذ أي رحلة بين مدن الحج وانا ملتزم باثبات
                    تواجدي في إحدى
                    مواقع منشأة النقل المختلفة (الشميسي - جدة - مكة - المدينة المنورة) حتى لا يتم تسجيلي غياب من قبل
                    الشركة. اقر
                    بأنني
                    قد تم أفهامي بأنني سوف اخضع لكشف عشوائي على المخدرات في المراكز المقامة على الطريق بين مدن المشاعر
                    المختلفة وفي
                    حال كانت النتائج ايجابية سوف تطبق بحقي العقوبات المنصوص عليها حسب قوانين المملكة العربية السعودية
                    والجزاءات
                    المترتبة على ذلك اضافة الى التسفير دون حقوق مادية أو معنوية بعد استيفاء عقوبة الدولة مع وضعي في
                    قائمة الممنوعين
                    من
                    الاستقدام مستقبلا.
                </p>
                <p style="margin-top: 10px;">وبذلك اتعهد بتنفيذ ما ورد اعلاه وفي حال عدم التزامي بتنفيذ ذلك فأني اتحمل
                    كامل
                    المسئولية وما يترتب عليها من عدم صرف المكافأة التي تصرف لي من الشركة وأكون عرضة للجزاء امام الجهات
                    المختصة.</p>
                <h1 class="underline-text"
                    style="width: fit-content; margin: 20px auto ; font-size :18px !important;;">واقر بانني
                    اطلعت علي ما جاء بعاليه وعليه واقع</h1>
                <div class="party" style="margin: 20px auto;">

                    <div class="field">
                        <div class="label">الاسم</div>
                        <div class="line">
                            <div class="value">
                                <span class="sync-name">{{ $client->name_ar }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <div class="label">التاريخ</div>
                        <div class="line">

                            <div class="value date"></div>
                        </div>

                    </div>
                    <div class="field">
                        <div class="label">التوقيع</div>
                        <div class="line">
                            <div class="value"></div>
                        </div>
                    </div>
                    <div class=""
                        style="margin-bottom: 0; display: flex; flex-direction: row-reverse; align-items: center;">
                        <div class="fingerprint-box" style="width: 100px;height: 100px; "></div>
                        <div class="">البصمة</div>
                    </div>

                </div>
            </div>

            <div class="page" style="margin-top: 20px;min-height: 297mm;">
                <h2 style="margin: 20px auto; width: fit-content;">اقرار وتعهد</h2>
                <p>اقر انا /
                    <span class="sync-name"></span>
                    ,الجنسية/ مصر واحمل جواز السفر /
                    <span class="sync-pass"></span>
                    الصادر من / _______ بأنني قد تم
                    افهامي من قبل مندوبي (____________)بانه لا يتوجب علي دفع اي مبلغ كانت قيمتها لاي شخص كان او اي جهة
                    كانت مقابل
                    تعاقدي مع (________________) خلال موسم الحج 1448هـ وان (______________) سوف تتحمل جميع المصاريف
                    المتعلقة
                    باستخراج
                    التأشيرة اللازمة السفري للمملكة العربية السعودية وقيمة تذكرة العودة على الباخرة أو الحافلة إلى بلادي
                    واتعهد
                    ببلاغ
                    الشركة فورا وخطايا عن أي شخص أو جهة تطلب أو تتقاضي مبالغ مهما كانت قيمتها ولاي سبب تدعيه الجهة
                    الطالبة دفع
                    المبلغ،
                    وفي حالة عدم إبلاغي عن دفع أي مبلغ وظهور ما يخالف ذلك للطرف الأول الحق باتخاذ أي اجراء ضدي تراه
                    مناسبا بما في
                    ذلك
                    إعادتي إلى بلادي غورا وبدون دفع اي مستحقات مالية تستحق لي طرف الطرف الأول وهذا إقرار وتعيد منى بما
                    جاء بعالية
                    واتعهد بعدم لبس الأحرام للحج أو العمرة اثناء قدومي عبر المنافذ المختلفة للمملكة العربية السعودية أو
                    اثناء عملي
                    لدى
                    الطرف الأول وأن الغرض من قدومي الى الطرف الأول هوا العمل

                    فقط واقر بأنني حال وصولي إلى مقر منشأة النقل واستلام بطاقتي الشخصية والسلفة النقدية أن أكون مستعدا
                    للعمل والتزم
                    مراجعة مكاتب الإدارة خلال ثلاثة ايام يتم تسليمي العهد الخاصة بعملي وفي حال عدم التزامي بذلك يحق
                    الطرف الأول
                    تغيبي عن
                    العمل وعدم دفع رواتب خلال هذه الفترة.
                </p>
                <p>
                    اقر بأنني اعلم ان منشأة النقل استقدمتني العمل بمهنة (سائق) وانه يتوجب على العمل دون تهاون أو تأخير
                    حتى لا اكون
                    عرضة للجزاء والمسائلة. وبهذا العهد بتنفيذ ما ورد اعلاه وفي حال عدم التزامي بتنفيذ ذلك فأني اتحمل
                    كامل المسئولية
                    وما يترتب عليها من عدم صرف المكافأة التي تصرف لي من الطرف الأول واكون عرضة للجزاء أمام الجهات
                    المختصة
                </p>
                <h2 class="underline-text" style="margin: 20px auto; width: fit-content; font-size: 18px!important;">
                    شرح مواد نظام
                    العمل الواردة في العقد</h2>
                <p>المادة (65) من نظام العمل والعمال السعودي</p>
                <ol>
                    <li>1) ن ينجزوا العمل المطلوب منهم بموجب عقد عملهم تحت اشراف صاحب العمل بأراداته ووفق تعليماته.
                    </li>
                    <li>2) أن يعيدوا الي صاحب العمل المواد الغير مستهلكة وان يعتنوا عناية كافية بالآلات والادوات
                        الموضوعة حت تصرفهم.
                    </li>
                    <li>3) ان يلتزموا بحسن السلوك والاخلاق اثناء العمل.</li>
                    <li>4) أن يقدموا كل عون ومساعدة بدون ان يتشرطوا لذلك اجرا في حالات الكوارث والاخطار التي تهدد سلامة
                        مكانهم العمل
                        أو الاشخاص العاملين فيه.</li>
                    <li>5) ان يخضعوا وفقا لطلب صاحب العمل إلى الفحوص الطبية والتي يرغب اجراءها قبل الالتحاق بالعمل أو
                        اثناء ذلك بغية
                        التحقق من خلوهم من الأمراض
                        المهنية أو السارية والغير قابلة للشفاء.</li>
                    <li>6) ان يحفظوا الاسرار الفنية أو التجارية أو الصناعية بصورة عامة جميع الأسرار المهنية المتعلقة
                        بالعمل والتي من
                        شائنها، افشائها الاضرار بمصلحة صاحب العمل</li>
                </ol>

                <h2 class="underline-text" style="margin: 30px auto; width: fit-content; font-size: 18px!important;">
                    اقر بانني
                    اطلعت علي ما جاء بعالية وعليه اوقع</h2>

                <div class="party" style="margin: 20px auto;">

                    <div class="field">
                        <div class="label">الاسم</div>
                        <div class="line">
                            <div class="value">
                                <span class="sync-name">{{ $client->name_ar }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <div class="label">التاريخ</div>
                        <div class="line">

                            <div class="value date"></div>
                        </div>

                    </div>
                    <div class="field">
                        <div class="label">التوقيع</div>
                        <div class="line">
                            <div class="value"></div>
                        </div>
                    </div>
                    <div class=""
                        style="margin-bottom: 0; display: flex; flex-direction: row-reverse; align-items: center;">
                        <div class="fingerprint-box" style="width: 150px;height: 150px; "></div>
                        <div class="">البصمة</div>
                    </div>

                </div>

            </div>
        </div>
    </div>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #e0e0e0;
            padding: 0;
            direction: rtl;
            font-size: 11px;
        }

        @media print {
            body {
                background: white;
                padding: 0;
                font-size: 11px;
            }

            .page {
                width: 210mm;
                min-height: 297mm;
                padding: 10mm 5mm 10mm 10mm;
                margin: 0;
                box-shadow: none;
                page-break-after: auto;
                page-break-inside: avoid;
            }

            table,
            tr,
            td {
                page-break-inside: auto;
                font-size: 10px;
            }

            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }

            @page {
                size: A4;
                margin: 5mm;
            }
        }

        .page {
            width: 210mm;
            background-color: white;
            padding: 10mm 5mm 10mm 10mm;
            margin: 0px auto;
            position: relative;
            font-size: 11px;
            line-height: 1.4;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 8px;
        }

        .header h1 {
            font-size: 14px;
            line-height: 1.4;
            margin-bottom: 4px;
        }

        .date-line,
        .content-text,
        .clause {
            font-size: 13px;
            line-height: 1.5;
            text-align: justify;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            border: 1px solid #000;
            padding: 5px;
            font-size: 10px;
            text-align: center;
        }

        .party-cell {
            background: #a5c0f1;
            color: #3e45d3;
            font-weight: bold;
            font-size: 12px;
            padding: 6px;
        }

        .label-cell {
            font-weight: bold;
            width: 20%;
            font-size: 12px;
        }

        .value-cell {
            background: #fff;
            font-size: 12px;
        }

        .salary-table td {
            font-size: 8px;
            /* padding: 4px; */
        }

        .table-header {
            color: #4139ce;
            font-weight: bold;
            text-align: center;
            font-size: 15px !important;
            padding: 6px;
        }

        .page-number {
            position: absolute;
            bottom: 5mm;
            left: 5mm;
            font-size: 10px;
            font-weight: bold;
        }

        .salary-table tr {
            page-break-inside: auto !important;
        }

        .num-cell {
            width: 25mm;
            text-align: center;
            vertical-align: middle;
        }

        .boldTD td {
            font-weight: bold;
        }

        .underline-text {
            border-bottom: 2px solid #000;
            padding-bottom: 2px;
            font-size: 14px;
        }
    </style>
    {{-- <script>
        // دالة الترجمة عبر جوجل
        async function translateWithGoogle(text) {
            try {
                const url =
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURI(text)}`;
                const response = await fetch(url);
                const data = await response.json();
                return data[0][0][0];
            } catch (e) {
                return "خطأ في الترجمة";
            }
        }

        // دالة المزامنة اللحظية
        function syncAll() {
            const name = document.getElementById('master-name').value;
            const nid = document.getElementById('master-id').value;
            const pass = document.getElementById('master-pass').value;

            document.querySelectorAll('.sync-name').forEach(el => el.innerText = name);
            document.querySelectorAll('.sync-id').forEach(el => el.innerText = nid);
            document.querySelectorAll('.sync-pass').forEach(el => el.innerText = pass);
        }

        // دالة سحب البيانات من MRZ
        async function startCapture() {
            const rawInput = prompt("يرجى لصق نص الـ MRZ الخاص بالجواز هنا:");
            if (!rawInput) return;

            let raw = rawInput.toUpperCase().replace(/[^A-Z0-9<]/g, '');

            // 1. استخراج الاسم وترتيبه
            let fullName = "";
            const egyIndex = raw.indexOf('EGY');
            if (egyIndex !== -1) {
                let namePart = raw.substring(egyIndex + 3).split(/[0-9]/)[0];
                let parts = namePart.split('<<');
                fullName = parts.length > 1 ? parts[1].replace(/<+/g, ' ').trim() + " " + parts[0].replace(/<+/g, ' ')
                    .trim() : namePart.replace(/<+/g, ' ').trim();
            }

            // 2. استخراج رقم الجواز
            const passMatch = raw.match(/A\d{8}/);
            const passport = passMatch ? passMatch[0] : "";

            // 3. استخراج أول 7 أرقام من القومي
            const birthMatch = raw.match(/EGY(\d{6})/);
            let firstSeven = "";
            if (birthMatch) {
                let year = parseInt(birthMatch[1].substring(0, 2));
                firstSeven = (year > 26 ? "2" : "3") + birthMatch[1];
            }

            // تعبئة لوحة التحكم
            document.getElementById('master-pass').value = passport;
            document.getElementById('master-id').value = firstSeven;
            document.getElementById('master-name').value = "جاري التعريب...";
            syncAll();

            // تعريب الاسم
            const translated = await translateWithGoogle(fullName);
            document.getElementById('master-name').value = translated;
            syncAll();
        }

        // مراقبة التعديلات اليدوية في لوحة التحكم
        document.addEventListener('DOMContentLoaded', () => {
            const inputs = ['master-name', 'master-id', 'master-pass'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', (e) => {
                    if (id === 'master-id') e.target.value = e.target.value.replace(/[^\d]/g, '');
                    syncAll();
                });
            });

            // بدء التشغيل
            startCapture();
        });
    </script>
    <script>
        // كود موحد لكل الصفحة يتم تشغيله مرة واحدة فقط
        (function() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}/${month}/${day}`;

            // تعبئة كل عنصر يمتلك كلاس date تلقائياً
            const dateElements = document.querySelectorAll('.date');
            dateElements.forEach(element => {
                element.textContent = formattedDate;
            });
        })();
    </script> --}}




</body>

</html>
