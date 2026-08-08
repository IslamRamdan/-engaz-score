import{j as e}from"./app-QAF83biT.js";import{A as p}from"./AppLayout-fhG-c-5V.js";import"./ThemeToggle-CFLNrNJs.js";function m(t){if(!t)return"غير متوفر";const a=t.split("T")[0];if(/^\d{4}-\d{2}-\d{2}$/.test(a))return a;const n=new Date(t);return isNaN(n.getTime())?"غير متوفر":n.toISOString().split("T")[0]}const b=({customer:t,group:a,jobs:n=[]})=>{const i={e_visa_number:a.customers?.[0]?.pivot?.e_number||null,request_date:(()=>{const s=new Date;s.setDate(s.getDate()-5);const l=s.getFullYear(),r=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0");return`${l}/${r}/${o}`})(),passport_id:t.passport_number,passport_type:"عادي",gender:t.gender==="female"?"أنثى":"ذكر",passport_expiry:m(t.passport_expiry_date),embassy_title:a.visa?.consulate||"غير متوفر",visa_period:{work_temp_hajj_umrah:"تأشيرة العمل المؤقت لخدمات الحج والعمرة",work:"عمل",temporary_work:"عمل مؤقت"}[a.visa?.type||""]||"غير متوفر",entries_count:a.visa?.type==="temporary_work"?"سفرة واحدة - 365 يوم":"سفرة واحدة - 90 يوم",sponsor_name:a.visa?.sponsor?.name,name_ar:t.name_ar,name_en_mrz:(()=>{const s=(t.name_en||"").trim().split(/\s+/);if(s.length===0||s[0]==="")return"غير متوفر";const l=s[0]||"",r=s[1]||"",o=s[2]||"",x=s.length>1?s[s.length-1]:"";return[l,r,o,x].filter((c,d,h)=>c!==""&&(d!==3||h.indexOf(c)===d||s.length>3)).join(" ")})(),job:n.find(s=>s.Value===a.notes)?.Text||a.notes||"---",date_birth:m(t.birth_date),governorate_live:t.governorate||"غير متوفر",nationality:"مصر",purpose:{work:`عمل لدى ${a.visa?.sponsor?.name||"---"}`,temporary_work:`عامل مؤقت لدى ${a.visa?.sponsor?.name||"---"}`,work_temp_hajj_umrah:`عمل موسمي لدى ${a.visa?.sponsor?.name||"---"}`}[a.visa?.type||""]||"غير متوفر"};return e.jsxs(p,{children:[e.jsx("button",{id:"printPage",className:"print-btn",onClick:()=>window.print(),children:"طباعة طلب دخول"}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
            // تنفيذ الطباعة تلقائيًا عند تحميل الصفحة
            window.addEventListener("load", function () {
              window.print();
            });
          `}}),e.jsx("div",{className:"page-content",id:"content","data-sort":"true",children:e.jsxs("div",{className:"container",children:[e.jsx("title",{children:"طباعة طلب دخول"}),e.jsx("meta",{name:"description",content:"eVisa"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx("style",{type:"text/css",dangerouslySetInnerHTML:{__html:`
                @font-face {
                    font-family: 'DIN Next LT Arabic Regular';
                    src: local('DIN Next LT Arabic Regular'),
                        url('FONT_DATA_DIN_NEXT_PLACEHOLDER') format('woff2');
                }

                @font-face {
                    font-family: "OCRB Regular";
                    src: local("OCRB Regular"),
                        url("FONT_DATA_OCRB_PLACEHOLDER") format('woff2');
                }

                body {
                    direction: rtl;
                    font-family: 'DIN Next LT Arabic Regular', Arial, Helvetica, sans-serif;
                    color: #5f6369;
                }

                .evisaCont-content td {
                    padding: 0px 60px;
                }

                .evisaCont-header th {
                    padding: 60px 60px 0;
                }

                .evisaCont-footer td {
                    padding: 40px 60px 60px;
                }

                /* custom styles */
                .evisa-container {
                    width: 100%;
                    height: 100%;
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                    max-width: 21cm;
                    font-size: 14px;
                }

                .evisa-bg-container {
                    position: absolute;
                    z-index: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                .evisa-bg {
                    width: 100%;
                }

                .evisa-content {
                    position: relative;
                    z-index: 1;
                }

                .evis-content-details {
                    font-size: 1em;
                    color: #5f6369;
                    line-height: 1.5em;
                }

                .evis-content-top-img {
                    width: 25%;
                    float: left;
                    background: #e0d7eb;
                }

                .evisa-img {
                    width: 100%;
                    border: 1px solid #e0d7eb;
                }

                .evis-content-top-details {
                    width: 70%;
                    float: right;
                    padding-top: 20px;
                }

                .clear {
                    clear: both;
                }

                .col-2 {
                    clear: both;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 5px;
                    padding-bottom: 7px;
                    border-bottom: 1px solid #553678;
                }

                .col-2-1 {
                    float: right;
                    width: 40%;
                    text-align: right;
                    font-size: 1em;
                }

                .col-2-2 {
                    text-align: center;
                    font-weight: bold;
                    color: #371260;
                }

                .evisa-data {
                    padding: 0;
                    margin: 0;
                    list-style: none;
                }

                .evisa-data li {
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    clear: both;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 5px;
                    padding-bottom: 7px;
                }

                .evisa-data span {
                    display: block;
                }

                .evisa-data-label.evisa-data-ar {
                    float: right;
                    width: 25%;
                    text-align: right;
                    font-size: 80%;
                    text-align: left;
                }

                .evisa-data-value {
                    text-align: center;
                    font-weight: bold;
                    width: 50%;
                }

                .evisa-data-label.evisa-data-en {
                    float: left;
                    width: 25%;
                    text-align: left;
                    direction: ltr;
                    font-size: 80%;
                    text-align: right;
                }

                .evisa-data-barcode img {
                    height: 20px !important;
                    width: 250px !important;
                }

                .evisa-data-barcode-number {
                    font-size: 80%;
                }

                .evisa-notes {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    color: #ed1c24;
                    line-height: 24px;
                }

                .evisa-fingerprint {
                    position: absolute;
                    bottom: 165px;
                    left: 80px;
                    max-width: 50px;
                }

                .evisa-fingerprint-img {
                    max-width: 100%;
                }

                .evisa-footer {
                    position: absolute;
                    z-index: 1;
                    bottom: 0;
                    width: 100%;
                }

                .evisa-qr {
                    position: relative;
                    text-align: center;
                }

                .evisa-qr-bg {
                    max-height: 80px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                    margin-right: 4px;
                }

                .evisa-qr-img {
                    width: 65px;
                    height: 65px;
                    display: block;
                    position: relative;
                    z-index: 3;
                    margin: -75px auto 0;
                }

                .evisa-mrz {
                    font-family: "OCRB Regular", "Times New Roman", Times, serif;
                    text-align: center;
                    direction: ltr;
                    margin: 40px 0;
                    line-height: 23px;
                }

                .evisa-mrz-1 {
                    display: block;
                }

                .evisa-mrz-2 {
                    display: block;
                }

                .evisa-header {
                    height: 105px;
                }

                .evisa-page-title {
                    display: inline-block;
                    width: 60%;
                    margin: 20px auto;
                    color: #4d2773;
                    font-family: 'DIN Next LT Arabic Regular', Arial, Helvetica, sans-serif;
                    font-size: 1.4em;
                    font-weight: 400;
                    text-align: center;
                }

                .evisa-header-left {
                    float: left;
                    width: 20%;
                    text-align: left;
                }

                .evisa-header-right {
                    float: right;
                    width: 20%;
                }

                .print-btn {
                    display: block;
                    margin: 20px auto;
                    padding: 12px 24px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    font-size: 18px;
                    border-radius: 6px;
                    font-family: 'DIN Next LT Arabic Regular', Arial, Helvetica, sans-serif;
                    cursor: pointer;
                }

                .back-btn {
                    display: block;
                    margin: 20px auto;
                    padding: 12px 24px;
                    background-color: rgb(207, 193, 0);
                    color: white;
                    border: none;
                    font-size: 18px;
                    border-radius: 6px;
                    font-family: 'DIN Next LT Arabic Regular', Arial, Helvetica, sans-serif;
                    cursor: pointer;
                }

                @media print {
                    .print-btn {
                        display: none;
                    }

                    .back-btn {
                        display: none;
                    }

                    .page-break {
                        page-break-before: always;
                    }
                }

                .evisa-header img {
                    height: 70px;
                }

                .evisa-sep-lrg img,
                .evisa-sep-sml img {
                    max-width: 100%;
                    margin: 20px 0;
                }

                .evisa-footer-img {
                    position: fixed;
                    right: 0;
                    bottom: 0;
                }

                .requestcode {
                    font-size: 0.8em;
                }

                .requestcode img {
                    width: 100%;
                    height: 30px;
                }

                .requestcode span {
                    display: block;
                    padding: 5px 0;
                    text-align: left;
                    color: #381460;
                    font-weight: bold;
                }

                .requestcode label {
                    float: right;
                    color: #5f6369;
                    font-weight: normal;
                }

                .instructions li {
                    page-break-inside: avoid;
                    margin-bottom: 10px;
                    margin-top: 5px;
                    font-size: 12px!important;
                }

                .instructions {
                    margin-bottom: 40px;
                }

                .instructions a {
                    color: #381460;
                }

                .row-sign {
                    border-bottom: 1px solid #381460;
                    padding: 10px 0;
                    max-width: 70%;
                }
              `}}),e.jsxs("div",{className:"evisa-container",children:[e.jsx("form",{action:"https://visa.mofa.gov.sa/SmartForm/PrintApplication/792902160",method:"post",children:e.jsxs("table",{className:"evisaCont-container",children:[e.jsx("thead",{className:"evisaCont-header",children:e.jsx("tr",{children:e.jsx("th",{className:"evisaCont-header-cell",children:e.jsx("div",{className:"header-info",children:e.jsxs("div",{className:"evisa-header",children:[e.jsx("div",{className:"evisa-header-left",children:e.jsx("img",{src:`${window.location.origin}/img/KSAVISA.png`,alt:"KSA VISA"})}),e.jsx("h1",{className:"evisa-page-title",children:"طلب تأشيرة دخول"}),e.jsx("div",{className:"evisa-header-right",children:e.jsxs("div",{className:"requestcode text-center",children:[e.jsxs("span",{className:"requestcode-number",children:[e.jsxs("label",{children:["رقم الطلب:"," "]}),i.e_visa_number]}),e.jsx("img",{id:"image",width:150,height:30,src:`https://visa.mofa.gov.sa/Base/GenerateBarCode?key=${i.e_visa_number}`}),e.jsxs("span",{className:"requestcode-date",children:[e.jsx("label",{children:"تاريخ الطلب :"}),i.request_date]})]})}),e.jsx("div",{className:"clear"})]})})})})}),e.jsx("tfoot",{className:"evisaCont-footer",children:e.jsx("tr",{children:e.jsx("td",{className:"evisaCont-footer-cell",children:e.jsx("div",{className:"footer-info",children:e.jsx("div",{className:"evisa-footer",children:e.jsx("div",{className:"evisa-footer-img",children:e.jsx("img",{src:"data:image/png;base64,PLACEHOLDER",alt:""})})})})})})}),e.jsx("tbody",{className:"evisaCont-content",children:e.jsx("tr",{children:e.jsx("td",{className:"evisaCont-content-cell",children:e.jsx("div",{className:"main",children:e.jsxs("div",{className:"evisa-content",children:[e.jsxs("div",{className:"evisa-content-top",children:[e.jsx("div",{className:"evis-content-top-img",children:e.jsx("img",{id:"image",className:"evisa-img",alt:"visa image",src:t.personal_image?`/storage/${t.personal_image}`:"/images/default-avatar.png"})}),e.jsxs("div",{className:"evis-content-top-details",children:[e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"رقم الجواز"}),e.jsx("div",{className:"col-2-2",children:i.passport_id})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"نوع الجواز"}),e.jsx("div",{className:"col-2-2",children:i.passport_type})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"الجنس"}),e.jsx("div",{className:"col-2-2",children:i.gender})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"تاريخ الانتهاء"}),e.jsx("div",{className:"col-2-2",children:i.passport_expiry})]}),e.jsx("div",{className:"evisa-sep-sml",children:e.jsx("img",{src:`${window.location.origin}/img/true.png`,alt:"-"})}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"الممثلية في"}),e.jsx("div",{className:"col-2-2",children:i.embassy_title})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"نوع التأشيرة"}),e.jsx("div",{className:"col-2-2",children:e.jsx("span",{children:i.visa_period})})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"عدد مرات الدخول"}),e.jsx("div",{className:"col-2-2",children:i.entries_count})]}),e.jsxs("div",{className:"col-2",children:[e.jsxs("div",{className:"col-2-1",children:[" ","اسم الشخص/الجهة الطالبة"]}),e.jsx("div",{className:"col-2-2",children:i.sponsor_name})]}),e.jsxs("div",{className:"col-2",children:[e.jsxs("div",{className:"col-2-1",children:[" ","الاسم"]}),e.jsx("div",{className:"col-2-2",children:i.name_ar})]}),e.jsxs("div",{className:"col-2",children:[e.jsxs("div",{className:"col-2-1",children:[" ","Name"]}),e.jsx("div",{className:"col-2-2",children:i.name_en_mrz})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"المهنة"}),e.jsx("div",{className:"col-2-2",children:i.job})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"تاريخ الميلاد"}),e.jsx("div",{className:"col-2-2",children:i.date_birth})]}),e.jsxs("div",{className:"col-2",children:[e.jsxs("div",{className:"col-2-1",children:[" ","مكان الميلاد"]}),e.jsx("div",{className:"col-2-2",children:i.governorate_live})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"الجنسية الحالية"}),e.jsx("div",{className:"col-2-2",children:i.nationality})]}),e.jsxs("div",{className:"col-2",children:[e.jsx("div",{className:"col-2-1",children:"الغرض"}),e.jsx("div",{className:"col-2-2",children:i.purpose})]})]}),e.jsx("div",{className:"clear"})]}),e.jsxs("div",{className:"evis-content-details",children:[e.jsx("div",{className:"form-group",children:e.jsx("p",{className:"Rednotification",style:{fontSize:"13px"},children:"أنا الموقع أدناه أوافق على أخذ بصمة الأصابع وقزحية العين كإجراء للتقدم بطلب تأشيرة دخول للمملكة العربية السعودية وأقر بإدراك وحرية كاملة بما يلي:"})}),e.jsx("div",{className:"form-group instructions",children:e.jsxs("ol",{className:"list-normal",children:[e.jsx("li",{style:{fontSize:"13px"},children:"أن كل المعلومات التي دونتها صحيحة， وأتعهد بأنه خلال إقامتي في المملكة العربية السعودية سوف التزم بكافة قوانينها وأنظمتها واحترام العادات والتقاليد الإسلامية لشعبها، وأقر بعلمي بأن من حق السلطات المختصة في المملكة عدم السماح لي بالدخول وإعادتي من حيث قدمت في حال مخالفتي للقوانين والأنظمة أو ثبوت عدم صحة البيانات التي حصلت بموجبها على تأشيرة الدخول."}),e.jsx("li",{style:{fontSize:"13px"},children:"أنني على علم تام بأن جميع المواد المسكرة والعقاقير المخدرة والمواد والمطبوعات المخلة بالآداب العامة وجميع المطبوعات التي لها مساس بأي معتقدات دينية أو أي اتجاهات سياسية وتتعارض مع الدين الإسلامي ممنوعة من دخول المملكة."}),e.jsxs("li",{style:{fontSize:"13px"},children:["أنني على علم تام بإجراءات وضوابط فسح الأدوية المحتوية على مواد مخدرة أو مؤثرات عقلية التي بحوزة المرضى القادمين إلى المملكة أو المغادرين منها للاستعمال الشخصي والمدونة في الرابط التالي:",e.jsx("br",{}),e.jsx("a",{href:"http://www.sfda.gov.sa/ar/drug/drug_reg/pages/drug_reg.aspx",target:"_blank",rel:"noreferrer",children:"http://www.sfda.gov.sa/ar/drug/drug_reg/pages/drug_reg.aspx"}),"وأن مخالفتي لذلك سوف يعرضني للجزاء وتطبيق العقوبات المنصوص عليها في نظام مكافحة المخدرات والمؤثرات العقلية ولائحته التنفيذية."]}),e.jsx("li",{style:{fontSize:"13px"},children:"أنه لم يسبق ترحيلي من المملكة العربية السعودية أو أي دولة من دول مجلس التعاون الخليجي، أو مخالفة الأنظمة المرعية بها."}),e.jsx("li",{style:{fontSize:"13px"},children:"أتعهد بأن التزم بنوع التأشيرة الممنوحة لي وشروطها ومدتها ومغادرة المملكة قبل انتهاء مدة الإقامة المحددة في تأشيرة الدخول، كما أنني على علم تام بأن مخالفتي للأنظمة المرعية في المملكة أو ارتكابي لأحد المحظورات المذكورة أعلاه أو تلك المدونة على تأشيرة الدخول سوف يعرضني للجزاء وتطبيق العقوبات التي نص عليها تنظيم معاملة القادمين للمملكة بتأشيرات دخول للحج أو العمرة وغيرها الصادر بالمرسوم الملكي رقم (م/42) وتاريخ 18/10/1404هـ وكذلك عقوبات مخالفي أنظمة الإقامة والعمل الصادر بموجب قرار مجلس الوزراء رقم (140) وتاريخ 6/5/1434هـ."}),e.jsx("li",{children:"أقر بحق السلطات السعودية في إعادتي من منفذ الدخول على حسابي الخاص أو إبعادي من أراضي المملكة بعد دخولي إليها وأن تطبق بحقي العقوبات المنصوص عليها نظامًا في حال ثبت في أي وقت من الأوقات بعد حصولي على التأشيرة أو رخصة الإقامة بأنني قمت بتقديم أوراق أو مستندات غير صحيحة أو الإفادة بأقوال كاذبة لدى أي سلطة سعودية مختصة في الداخل أو الخارج بقصد الحصول لنفسي أو لشخص آخر على سمة الدخول أو الإقامة أو أي تأشيرة رسمية أو كنت مساهمًا أو شريكًا في تقديم هذه المعلومات أو المستندات على خلاف الحقيقة والواقع."}),e.jsx("li",{children:"أقر بالعلم أن عقوبة تهريب المخدرات إلى المملكة أو ترويجها داخلها هي القتل."}),e.jsx("li",{children:"أتعهد بأن ألتزم بالإقرار عن المبالغ النقدية أو المعادن الثمينة وما في حكمها التي تصل قيمتها إلى (60,000) ستين ألف ريال أو أكثر أو ما يعادلها من العملات الأجنبية، أثناء قدومي إلى المملكة أو مغادرتي منها، كما أتعهد بأن ألتزم بالإقرار عن أي أمتعة ثمينة بصحبتي عند قدومي إلى المملكة واستعدادي لدفع الرسوم الجمركية والضرائب المستحقة عليها، وفي حال مخالفتي ذلك فإنه يعرضني للمساءلة القانونية وتطبيق ما تقضي به أنظمة المملكة بحقي."}),e.jsx("li",{children:"أقر بالعلم أن الأنظمة بالمملكة تجرم دفع أي مبلغ رشوة بغض النظر عن مقداره وتعتبر قضية جنائية تعرض ممارسها لعقوبة السجن أو دفع غرامة أو كليهما معًا."}),e.jsx("li",{children:"أقر وأتعهد مجددًا بأن جميع المعلومات التي دونتها صحيحة وأتحمل كامل المسؤولية عنها، وفي حال ثبوت خلاف ذلك -أو اتضح أنني مدرج على قائمة الممنوعين- فإنه سوف يتم رفض طلبي، أو إلغاء التأشيرة آليًا في حال حصولي عليها، أو عدم السماح لي من دخول المملكة العربية السعودية في حال كان لدي تأشيرة سارية، وأقر بحق السلطات السعودية في إعادتي من منفذ الدخول على حسابي الخاص وليس لي الحق في المطالبة بالتعويض."})]})}),e.jsxs("div",{className:"form-group",children:[e.jsxs("div",{className:"row row-sign",children:[e.jsx("label",{className:"control-label col-md-4 col-sm-4 col-xs-4",children:"الاســم :"}),e.jsx("div",{className:"col-md-4 col-sm-4 col-xs-4",children:i.name_ar})]}),e.jsxs("div",{className:"row row-sign",children:[e.jsx("label",{className:"control-label col-md-4 col-sm-4 col-xs-4",children:"التوقيع :"}),e.jsx("div",{className:"col-md-4 col-sm-4 col-xs-4"})]}),e.jsxs("div",{className:"row row-sign",children:[e.jsx("label",{className:"control-label col-md-4 col-sm-4 col-xs-4",children:"التاريخ :"}),e.jsx("div",{className:"col-md-4 col-sm-4 col-xs-4",children:i.request_date})]})]})]})]})})})})})]})}),e.jsx("div",{className:"page-break"})]})]})}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
            $(function () {
              $('#printPage').click(function () {
                var container = $('.container').css('width');
                var printFrame = $('.printFrame').css('border');
                var contentmidH = $('.contentmid').css('min-height');
                var contentmidPT = $('.contentmid').css('padding-top');
                var contentmidPB = $('.contentmid').css('padding-bottom');
                var contentmidPL = $('.contentmid').css('padding-left');
                var contentmidPR = $('.contentmid').css('padding-right');

                $('.breadcrumb,h3.form-title,.importantInfo,.btndiv,.footer,.formhead,.logo,.contenttop,.contentbottom')
                  .css('display', 'none');
                $('.container').css('width', '655px');
                $('.printFrame').css('border', '1px solid #8a8a8a');
                $('.contentmid').css('padding', '0 0 0 0');

                window.print();

                $('.breadcrumb,h3.form-title,.importantInfo,.btndiv,.footer,.formhead,.logo,.contenttop,.contentbottom')
                  .css('display', '');
                $('.container').css('width', container);
                $('.printFrame').css('border', printFrame);
                $('.contentmid').css('padding-top', contentmidPT);
                $('.contentmid').css('padding-bottom', contentmidPB);
                $('.contentmid').css('padding-left', contentmidPL);
                $('.contentmid').css('padding-right', contentmidPR);
              });
            });
          `}})]})};export{b as NetReservation,b as default};
