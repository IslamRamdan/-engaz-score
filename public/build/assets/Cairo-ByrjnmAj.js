import{r as s,j as t}from"./app-DVNyx2tF.js";import{A as y}from"./AppLayout-DGKReC-S.js";import"./ThemeToggle-Enesy-X8.js";function N({customer:n,jobs:o}){const[r,l]=s.useState(!1),[x,c]=s.useState(""),[d,h]=s.useState(""),[a,p]=s.useState(null);s.useEffect(()=>{const e=window.prompt("من فضلك أدخل رقم الوكالة:");e&&c(e);const u=window.confirm(`هل تريد إعادة طباعة؟
اضغط 'موافق' لإعادة الطباعة، أو 'إلغاء' لبطاقة عادية.`);l(u)},[]);const j=()=>{if(d.trim()===""){alert("من فضلك اكتب التوقيع");return}p(d)},i=n.groups?.[0],g=i?.visa?.sponsor?.name??"-",m=i?.visa?.sponsor?.id_number??"-",b=i?.visa?.issue_number??"-",f=i?.pivot?.e_number??n.e_number??"-";return i?.notes,t.jsxs(y,{children:[t.jsx("style",{children:`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f5f5f5;
                }

                .nomination-page {
                    position: relative;
                    direction: rtl;
                    width: 210mm;
                    margin: 0 auto;
                    background: white;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .nomination-bg-image {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .nomination-content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    box-sizing: border-box;
                    padding: 20mm;
                    padding-top: 145px;
                }

                .nomination-header {
                    text-align: center;
                    margin-bottom: 5px;
                }

                .nomination-header h1 {
                    font-size: 18px;
                    margin-bottom: 5px;
                }

                .nomination-header h2 {
                    font-size: 21px;
                    font-weight: bold;
                }

                .nomination-section-title {
                    text-align: center;
                    font-size: 14px;
                    font-weight: bold;
                    margin: 25px 0 5px 0;
                }

                .nomination-page table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 5px;
                }

                .nomination-page table,
                .nomination-page th,
                .nomination-page td {
                    border: 2px solid #000;
                }

                .nomination-top th,
                .nomination-top td {
                    padding: 3px 5px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 900;
                }

                .nomination-owner-data td {
                    height: 35px;
                }

                .nomination-red-text {
                    color: red;
                    font-weight: bold;
                }

                .nomination-barcode-note {
                    font-size: 15px;
                    color: red;
                    margin-top: -15px;
                    margin-bottom: 20px;
                    font-weight: bold;
                }

                .nomination-barcode-left {
                    text-align: left;
                }

                .nomination-barcode-right {
                    text-align: right;
                }

                .nomination-applicant-data td {
                    // height: 30px;
                }

                .nomination-notes-table {
                    border: 7px solid black;
                }

                .nomination-notes-table td {
                    text-align: right;
                    padding: 5px 10px;
                    font-size: 10px;
                    vertical-align: top;
                    font-weight: bold;
                }

                .nomination-signature-section {
                    margin-top: 5px;
                    text-align: right;
                    font-size: 16px;
                    font-style: italic;
                    font-weight: bold;
                }

                .nomination-print-button {
                    position: fixed;
                    top: 70px;
                    left: 20px;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .nomination-print-button:hover {
                    background-color: #45a049;
                }

                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }

                    .nomination-page {
                        margin: 0;
                        box-shadow: none;
                        page-break-after: avoid;
                        page-break-inside: avoid;
                        width: 210mm;
                        height: 297mm;
                        overflow: hidden;
                    }

                    .no-print {
                        display: none;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                }
            `}),t.jsx("button",{className:"nomination-print-button no-print",onClick:()=>window.print(),children:"طباعة الاستمارة"}),t.jsxs("div",{className:"nomination-page",children:[t.jsx("img",{className:"nomination-bg-image",src:"/img/Screenshot_1.png",alt:""}),t.jsxs("div",{className:"nomination-content",children:[t.jsxs("div",{className:"nomination-header",children:[r&&t.jsx("h1",{style:{border:"3px solid black",width:"fit-content",padding:"5px",margin:"0 auto 5px",color:"red",fontWeight:"bold"},children:"اعاده طباعة"}),!r&&t.jsx("h1",{children:"استمارة ترشيح عمل"}),t.jsx("h2",{children:t.jsx("u",{children:"بيانات صاحب العمل"})})]}),t.jsxs("div",{style:{display:"flex",gap:"10px",height:"164px"},children:[t.jsx("table",{className:"nomination-top",style:{border:"7px solid black",margin:"0 auto"},children:t.jsxs("tbody",{children:[t.jsxs("tr",{children:[t.jsx("td",{style:{textAlign:"start",width:"23%"},children:"الاسم"}),t.jsx("td",{style:{width:"50%"},children:g}),t.jsxs("td",{rowSpan:4,style:{verticalAlign:"top",textAlign:"end"},children:["رقم الصندوق :"," ",t.jsx("span",{style:{display:"block",width:"100%",textAlign:"center",fontSize:"35px"},children:"418"})]})]}),t.jsxs("tr",{children:[t.jsx("td",{style:{textAlign:"start"},children:"رقم التأشيرة"}),t.jsxs("td",{style:{width:"60%",textAlign:"start",color:"red"},children:[t.jsx("span",{children:"رقم"}),": ",m]})]}),t.jsxs("tr",{children:[t.jsx("td",{style:{textAlign:"start"},children:"رقم السجل"}),t.jsxs("td",{style:{width:"60%",textAlign:"start",color:"red"},children:[t.jsx("span",{children:"رقم"}),": ",b]})]}),t.jsxs("tr",{children:[t.jsx("td",{style:{textAlign:"start"},children:"رقم الوكالة"}),t.jsx("td",{style:{width:"60%"},children:x})]})]})}),t.jsx("div",{style:{width:"25%"},children:t.jsx("img",{style:{maxWidth:"100%",borderRadius:"8px",height:"164px"},src:n.personal_image?`/storage/${n.personal_image}`:"",alt:""})})]}),t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"20px",marginBottom:"31px"},children:[t.jsx("div",{className:"nomination-barcode-note nomination-barcode-left",children:"باركود رقم التاشيرة"}),t.jsx("div",{className:"nomination-barcode-note nomination-barcode-right",children:"باركود رقم انجاز"})]}),t.jsx("div",{className:"nomination-section-title",children:t.jsx("h2",{children:t.jsx("u",{children:"بيانات طالب العمل"})})}),t.jsx("table",{className:"nomination-applicant-data",children:t.jsxs("tbody",{children:[t.jsxs("tr",{children:[t.jsx("th",{children:"الاسم"}),t.jsx("th",{children:"رقم الجواز"}),t.jsx("th",{children:"رقم انجاز"}),t.jsx("th",{children:"المهنة"}),t.jsx("th",{children:"المؤهل"})]}),t.jsxs("tr",{children:[t.jsx("td",{style:{fontWeight:"bold",textAlign:"center"},children:n.name_ar}),t.jsx("td",{style:{fontWeight:"bold",textAlign:"center"},children:n.passport_number}),t.jsx("td",{style:{fontWeight:"bold",textAlign:"center"},children:f}),t.jsx("td",{style:{fontWeight:"bold",textAlign:"center",padding:"0"},className:"px-6 py-4 text-sm text-zinc-800 dark:text-zinc-200 max-w-xs truncate",title:o.find(e=>e.Value===n.groups?.[0].notes)?.Text||n.groups?.[0].notes||"",children:o.find(e=>e.Value===n.groups?.[0].notes)?.Text||"---"}),t.jsx("td",{style:{fontWeight:"bold",textAlign:"center"}})]})]})}),t.jsx("table",{cellPadding:8,className:"nomination-notes-table",children:t.jsxs("tbody",{children:[t.jsxs("tr",{children:[t.jsx("td",{rowSpan:13,style:{width:"16%"},children:"ملاحظات"}),t.jsx("td",{}),t.jsx("td",{children:"لا يوجد كشف طبي (معامل/ مستشفي خاص)"}),t.jsx("td",{}),t.jsx("td",{children:"الصورة خطأ او غير موجودة"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"غير لائق بسبب ............."}),t.jsx("td",{}),t.jsx("td",{children:"استمارة الترشيح غير موقعة او غير مختومة"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"لا يوجد مؤهل دراسي"}),t.jsx("td",{}),t.jsx("td",{children:"المهنة مختلفة في الجواز عن التاشيرة"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"المؤهل (غير مطابق او غير مصدق)"}),t.jsx("td",{}),t.jsx("td",{children:"صلاحيةالجواز اقل من 6 اشهر"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"مطلوب شهادة خبرة"}),t.jsx("td",{}),t.jsx("td",{children:"الشركة موقوفة"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"لا توجد وكالة من صاحب العمل"}),t.jsx("td",{}),t.jsx("td",{children:"يوجد خطا فى بيانات النت ......"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"يوجد اكثر من وكالة للتاشيرة"}),t.jsx("td",{}),t.jsx("td",{children:"المهنة المطلوبة او الامر منفذ بالكامل"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"خطا في الفيش والتشبيه (الاسم / العلامة / الصلاحية)"}),t.jsx("td",{}),t.jsx("td",{children:"الجواز لا يوجد عليه لاصق المكتب"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"اقر العامل بالموافقة علي المهنة"}),t.jsx("td",{}),t.jsx("td",{children:"لا توجد رخصة قيادة او غير مطابقة للمهنة"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"خطاب موافقة من صاحب العمل بالاستثناء"}),t.jsx("td",{}),t.jsx("td",{children:" الاعتماد المهني"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"العمر اقل او اكثر من المطلوب (21 - 60)"}),t.jsx("td",{}),t.jsx("td",{children:"الفحص المهني"})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:"الباركود يقرا خطا او غير صحيح"}),t.jsx("td",{}),t.jsx("td",{children:"ملاحظة اخري ..................."})]}),t.jsxs("tr",{children:[t.jsx("td",{}),t.jsx("td",{children:" الخصائص الحيوية (البصمة)"}),t.jsx("td",{}),t.jsx("td",{})]})]})}),t.jsxs("div",{className:"nomination-signature-section",style:{display:"flex",justifyContent:"space-between",gap:"20px"},children:[t.jsxs("div",{style:{margin:0,padding:0},children:[t.jsx("span",{children:"المرفقات:"}),a?t.jsx("p",{style:{whiteSpace:"pre-wrap",padding:0,fontSize:"12px",fontWeight:100},children:a}):t.jsxs(t.Fragment,{children:[t.jsx("br",{}),t.jsx("textarea",{cols:30,rows:5,value:d,onChange:e=>h(e.target.value)}),t.jsx("br",{}),t.jsx("button",{onClick:j,children:"حفظ"})]})]}),t.jsxs("div",{style:{fontSize:"12px"},children:[t.jsx("div",{children:"أتعهد بصحة البيانات أعلاه"}),t.jsx("div",{children:"التوقيع المعتمد والختم"})]})]})]})]})]})}export{N as default};
