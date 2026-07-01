import React from "react";
import AppLayout from "@/Layouts/AppLayout";

// بيانات وهمية (Dummy Data) لعرض التصميم فقط - يجب استبدالها ببيانات حقيقية من الـ backend

interface Sponsor {
    id: number;
    name: string;
}
interface PivotData {
    customer_id: number;
    group_id: number;
    medical_status: string;
    medical_token: string | null;
    lab_status: string;
    enet_status: string;
    e_number: string | null;
}
interface Visa {
    id: number;
    visa_number: string;
    sponsor?: Sponsor; // علاقة الكفيل داخل التأشيرة
    consulate: string;
    type: string;
}

interface Group {
    id: number;
    name: string;
    visa?: Visa; // علاقة التأشيرة داخل المجموعة كما أرسلتها من الكنترولر
    notes: Number;
    customers?: Customer[]; // مصفوفة العملاء المشحونة // هنا تتواجد بيانات الجدول الوسيط
}

interface Customer {
    id: number;
    name_ar: string;
    phone: string;
    pivot?: PivotData; // هنا تتواجد بيانات الجدول الوسيط
    passport_number: string;
    passport_expiry_date: Date;
    gender: string;
    name_en: string;
    birth_date: Date;
    governorate: string;
    personal_image: string;
}

interface NetReservationProps {
    customer: Customer;
    group: Group;
    jobs: Job[]; // إضافة التايب هنا
}
export interface Job {
    Value: string | number;
    Text: string;
}

export const NetReservation: React.FC<NetReservationProps> = ({
    customer,
    group,
    jobs = [],
}) => {
    const customerPivot = group.customers?.[0]?.pivot;

    const dummyCustomer = {
        e_visa_number: customerPivot?.e_number || null,
        request_date: (() => {
            const date = new Date();
            date.setDate(date.getDate() - 5); // طرح 5 أيام من تاريخ اليوم الحالي

            const year = date.getFullYear();
            // إضافة صفر على اليسار إذا كان الشهر أو اليوم أقل من 10 لضمان تنسيق خانتين
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return `${year}/${month}/${day}`;
        })(),
        passport_id: customer.passport_number,
        passport_type: "عادي",
        gender: customer.gender === "female" ? "أنثى" : "ذكر",
        passport_expiry:
            customer.passport_expiry_date?.split("T")[0] || "غير متوفر",
        embassy_title: group.visa?.consulate || "غير متوفر",
        visa_period:
            {
                work_temp_hajj_umrah: "تأشيرة العمل المؤقت لخدمات الحج والعمرة",
                work: "عمل",
                temporary_work: "عمل مؤقت",
            }[group.visa?.type || ""] || "غير متوفر",

        entries_count:
            group.visa?.type === "temporary_work"
                ? "سفرة واحدة - 365 يوم"
                : "سفرة واحدة - 90 يوم",
        sponsor_name: group.visa?.sponsor?.name,
        name_ar: customer.name_ar,
        name_en_mrz: (() => {
            // 1. تفكيك الاسم بناءً على المسافات وتصفية أي مسافات زائدة بالخطأ
            const nameParts = (customer.name_en || "").trim().split(/\s+/);

            // إذا كان الاسم فارغاً تماماً
            if (nameParts.length === 0 || nameParts[0] === "")
                return "غير متوفر";

            const first = nameParts[0] || "";
            const second = nameParts[1] || "";
            const third = nameParts[2] || "";

            // جلب الاسم الأخير بناءً على طول المصفوفة (نفس منطق count($nameParts) - 1)
            const last =
                nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

            // 2. دمج الأسماء، وإزالة أي مسافات زائدة إذا كان الاسم أقل من 4 مقاطع
            // استخدام Set يضمن عدم تكرار الاسم الأخير إذا كان الاسم ثنائياً أو ثلاثياً فقط
            const uniqueParts = [first, second, third, last].filter(
                (part, index, self) => {
                    return (
                        part !== "" &&
                        (index !== 3 ||
                            self.indexOf(part) === index ||
                            nameParts.length > 3)
                    );
                },
            );

            return uniqueParts.join(" ");
        })(),
        job:
            jobs.find((j: any) => j.Value === group.notes)?.Text ||
            group.notes ||
            "---",
        date_birth: customer.birth_date?.split("T")[0] || "غير متوفر",
        governorate_live: customer.governorate || "غير متوفر",
        nationality: "مصر",
        purpose:
            {
                work: `عمل لدى ${group.visa?.sponsor?.name || "---"}`,
                temporary_work: `عامل مؤقت لدى ${group.visa?.sponsor?.name || "---"}`,
                work_temp_hajj_umrah: `عمل موسمي لدى ${group.visa?.sponsor?.name || "---"}`,
            }[group.visa?.type || ""] || "غير متوفر",
    };
    return (
        <AppLayout>
            <button
                id="printPage"
                className="print-btn"
                onClick={() => window.print()}
            >
                طباعة طلب دخول
            </button>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
            // تنفيذ الطباعة تلقائيًا عند تحميل الصفحة
            window.addEventListener("load", function () {
              window.print();
            });
          `,
                }}
            />

            {/* @foreach ($customers as $customer) */}
            <div className="page-content" id="content" data-sort="true">
                <div className="container">
                    <title>طباعة طلب دخول</title>
                    <meta name="description" content="eVisa" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />

                    <style
                        type="text/css"
                        dangerouslySetInnerHTML={{
                            __html: `
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
              `,
                        }}
                    />

                    <div className="evisa-container">
                        <form
                            action="https://visa.mofa.gov.sa/SmartForm/PrintApplication/792902160"
                            method="post"
                        >
                            <table className="evisaCont-container">
                                <thead className="evisaCont-header">
                                    <tr>
                                        <th className="evisaCont-header-cell">
                                            <div className="header-info">
                                                <div className="evisa-header">
                                                    <div className="evisa-header-left">
                                                        <img
                                                            src={`${window.location.origin}/img/KSAVISA.png`}
                                                            alt="KSA VISA"
                                                        />
                                                    </div>
                                                    <h1 className="evisa-page-title">
                                                        طلب تأشيرة دخول
                                                    </h1>
                                                    <div className="evisa-header-right">
                                                        <div className="requestcode text-center">
                                                            <span className="requestcode-number">
                                                                <label>
                                                                    رقم
                                                                    الطلب:{" "}
                                                                </label>
                                                                {
                                                                    dummyCustomer.e_visa_number
                                                                }
                                                            </span>
                                                            <img
                                                                id="image"
                                                                width={150}
                                                                height={30}
                                                                src={`https://visa.mofa.gov.sa/Base/GenerateBarCode?key=${dummyCustomer.e_visa_number}`}
                                                            />
                                                            <span className="requestcode-date">
                                                                <label>
                                                                    تاريخ الطلب
                                                                    :
                                                                </label>
                                                                {
                                                                    dummyCustomer.request_date
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="clear"></div>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                <tfoot className="evisaCont-footer">
                                    <tr>
                                        <td className="evisaCont-footer-cell">
                                            <div className="footer-info">
                                                <div className="evisa-footer">
                                                    <div className="evisa-footer-img">
                                                        <img
                                                            src="data:image/png;base64,PLACEHOLDER"
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>

                                <tbody className="evisaCont-content">
                                    <tr>
                                        <td className="evisaCont-content-cell">
                                            <div className="main">
                                                <div className="evisa-content">
                                                    <div className="evisa-content-top">
                                                        <div className="evis-content-top-img">
                                                            <img
                                                                id="image"
                                                                className="evisa-img"
                                                                alt="visa image"
                                                                // نتحقق أولاً إذا كانت هناك صورة للعميل، نقوم بربطها بـ /storage/ وإلا نضع صورة افتراضية أو فارغة
                                                                src={
                                                                    customer.personal_image
                                                                        ? `/storage/${customer.personal_image}`
                                                                        : "/images/default-avatar.png"
                                                                }
                                                            />
                                                        </div>

                                                        <div className="evis-content-top-details">
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    رقم الجواز
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.passport_id
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    نوع الجواز
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.passport_type
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    الجنس
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.gender
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    تاريخ
                                                                    الانتهاء
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.passport_expiry
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="evisa-sep-sml">
                                                                <img
                                                                    src={`${window.location.origin}/img/true.png`}
                                                                    alt="-"
                                                                />
                                                            </div>

                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    الممثلية في
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.embassy_title
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    نوع التأشيرة
                                                                </div>
                                                                <div className="col-2-2">
                                                                    <span>
                                                                        {
                                                                            dummyCustomer.visa_period
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    عدد مرات
                                                                    الدخول
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.entries_count
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    {" "}
                                                                    اسم
                                                                    الشخص/الجهة
                                                                    الطالبة
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.sponsor_name
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    {" "}
                                                                    الاسم
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.name_ar
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    {" "}
                                                                    Name
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.name_en_mrz
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    المهنة
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.job
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    تاريخ
                                                                    الميلاد
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.date_birth
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    {" "}
                                                                    مكان الميلاد
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.governorate_live
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    الجنسية
                                                                    الحالية
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.nationality
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="col-2-1">
                                                                    الغرض
                                                                </div>
                                                                <div className="col-2-2">
                                                                    {
                                                                        dummyCustomer.purpose
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="clear"></div>
                                                    </div>

                                                    <div className="evis-content-details">
                                                        <div className="form-group">
                                                            <p
                                                                className="Rednotification"
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                }}
                                                            >
                                                                أنا الموقع أدناه
                                                                أوافق على أخذ
                                                                بصمة الأصابع
                                                                وقزحية العين
                                                                كإجراء للتقدم
                                                                بطلب تأشيرة دخول
                                                                للمملكة العربية
                                                                السعودية وأقر
                                                                بإدراك وحرية
                                                                كاملة بما يلي:
                                                            </p>
                                                        </div>

                                                        <div className="form-group instructions">
                                                            <ol className="list-normal">
                                                                <li
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                    }}
                                                                >
                                                                    أن كل
                                                                    المعلومات
                                                                    التي دونتها
                                                                    صحيحة，
                                                                    وأتعهد بأنه
                                                                    خلال إقامتي
                                                                    في المملكة
                                                                    العربية
                                                                    السعودية سوف
                                                                    التزم بكافة
                                                                    قوانينها
                                                                    وأنظمتها
                                                                    واحترام
                                                                    العادات
                                                                    والتقاليد
                                                                    الإسلامية
                                                                    لشعبها، وأقر
                                                                    بعلمي بأن من
                                                                    حق السلطات
                                                                    المختصة في
                                                                    المملكة عدم
                                                                    السماح لي
                                                                    بالدخول
                                                                    وإعادتي من
                                                                    حيث قدمت في
                                                                    حال مخالفتي
                                                                    للقوانين
                                                                    والأنظمة أو
                                                                    ثبوت عدم صحة
                                                                    البيانات
                                                                    التي حصلت
                                                                    بموجبها على
                                                                    تأشيرة
                                                                    الدخول.
                                                                </li>
                                                                <li
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                    }}
                                                                >
                                                                    أنني على علم
                                                                    تام بأن جميع
                                                                    المواد
                                                                    المسكرة
                                                                    والعقاقير
                                                                    المخدرة
                                                                    والمواد
                                                                    والمطبوعات
                                                                    المخلة
                                                                    بالآداب
                                                                    العامة وجميع
                                                                    المطبوعات
                                                                    التي لها
                                                                    مساس بأي
                                                                    معتقدات
                                                                    دينية أو أي
                                                                    اتجاهات
                                                                    سياسية
                                                                    وتتعارض مع
                                                                    الدين
                                                                    الإسلامي
                                                                    ممنوعة من
                                                                    دخول
                                                                    المملكة.
                                                                </li>
                                                                <li
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                    }}
                                                                >
                                                                    أنني على علم
                                                                    تام بإجراءات
                                                                    وضوابط فسح
                                                                    الأدوية
                                                                    المحتوية على
                                                                    مواد مخدرة
                                                                    أو مؤثرات
                                                                    عقلية التي
                                                                    بحوزة المرضى
                                                                    القادمين إلى
                                                                    المملكة أو
                                                                    المغادرين
                                                                    منها
                                                                    للاستعمال
                                                                    الشخصي
                                                                    والمدونة في
                                                                    الرابط
                                                                    التالي:
                                                                    <br />
                                                                    <a
                                                                        href="http://www.sfda.gov.sa/ar/drug/drug_reg/pages/drug_reg.aspx"
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        http://www.sfda.gov.sa/ar/drug/drug_reg/pages/drug_reg.aspx
                                                                    </a>
                                                                    وأن مخالفتي
                                                                    لذلك سوف
                                                                    يعرضني
                                                                    للجزاء
                                                                    وتطبيق
                                                                    العقوبات
                                                                    المنصوص
                                                                    عليها في
                                                                    نظام مكافحة
                                                                    المخدرات
                                                                    والمؤثرات
                                                                    العقلية
                                                                    ولائحته
                                                                    التنفيذية.
                                                                </li>
                                                                <li
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                    }}
                                                                >
                                                                    أنه لم يسبق
                                                                    ترحيلي من
                                                                    المملكة
                                                                    العربية
                                                                    السعودية أو
                                                                    أي دولة من
                                                                    دول مجلس
                                                                    التعاون
                                                                    الخليجي، أو
                                                                    مخالفة
                                                                    الأنظمة
                                                                    المرعية بها.
                                                                </li>
                                                                <li
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                    }}
                                                                >
                                                                    أتعهد بأن
                                                                    التزم بنوع
                                                                    التأشيرة
                                                                    الممنوحة لي
                                                                    وشروطها
                                                                    ومدتها
                                                                    ومغادرة
                                                                    المملكة قبل
                                                                    انتهاء مدة
                                                                    الإقامة
                                                                    المحددة في
                                                                    تأشيرة
                                                                    الدخول، كما
                                                                    أنني على علم
                                                                    تام بأن
                                                                    مخالفتي
                                                                    للأنظمة
                                                                    المرعية في
                                                                    المملكة أو
                                                                    ارتكابي لأحد
                                                                    المحظورات
                                                                    المذكورة
                                                                    أعلاه أو تلك
                                                                    المدونة على
                                                                    تأشيرة
                                                                    الدخول سوف
                                                                    يعرضني
                                                                    للجزاء
                                                                    وتطبيق
                                                                    العقوبات
                                                                    التي نص
                                                                    عليها تنظيم
                                                                    معاملة
                                                                    القادمين
                                                                    للمملكة
                                                                    بتأشيرات
                                                                    دخول للحج أو
                                                                    العمرة
                                                                    وغيرها
                                                                    الصادر
                                                                    بالمرسوم
                                                                    الملكي رقم
                                                                    (م/42)
                                                                    وتاريخ
                                                                    18/10/1404هـ
                                                                    وكذلك عقوبات
                                                                    مخالفي أنظمة
                                                                    الإقامة
                                                                    والعمل
                                                                    الصادر بموجب
                                                                    قرار مجلس
                                                                    الوزراء رقم
                                                                    (140) وتاريخ
                                                                    6/5/1434هـ.
                                                                </li>
                                                                <li>
                                                                    أقر بحق
                                                                    السلطات
                                                                    السعودية في
                                                                    إعادتي من
                                                                    منفذ الدخول
                                                                    على حسابي
                                                                    الخاص أو
                                                                    إبعادي من
                                                                    أراضي
                                                                    المملكة بعد
                                                                    دخولي إليها
                                                                    وأن تطبق
                                                                    بحقي
                                                                    العقوبات
                                                                    المنصوص
                                                                    عليها نظامًا
                                                                    في حال ثبت
                                                                    في أي وقت من
                                                                    الأوقات بعد
                                                                    حصولي على
                                                                    التأشيرة أو
                                                                    رخصة الإقامة
                                                                    بأنني قمت
                                                                    بتقديم أوراق
                                                                    أو مستندات
                                                                    غير صحيحة أو
                                                                    الإفادة
                                                                    بأقوال كاذبة
                                                                    لدى أي سلطة
                                                                    سعودية مختصة
                                                                    في الداخل أو
                                                                    الخارج بقصد
                                                                    الحصول لنفسي
                                                                    أو لشخص آخر
                                                                    على سمة
                                                                    الدخول أو
                                                                    الإقامة أو
                                                                    أي تأشيرة
                                                                    رسمية أو كنت
                                                                    مساهمًا أو
                                                                    شريكًا في
                                                                    تقديم هذه
                                                                    المعلومات أو
                                                                    المستندات
                                                                    على خلاف
                                                                    الحقيقة
                                                                    والواقع.
                                                                </li>
                                                                <li>
                                                                    أقر بالعلم
                                                                    أن عقوبة
                                                                    تهريب
                                                                    المخدرات إلى
                                                                    المملكة أو
                                                                    ترويجها
                                                                    داخلها هي
                                                                    القتل.
                                                                </li>
                                                                <li>
                                                                    أتعهد بأن
                                                                    ألتزم
                                                                    بالإقرار عن
                                                                    المبالغ
                                                                    النقدية أو
                                                                    المعادن
                                                                    الثمينة وما
                                                                    في حكمها
                                                                    التي تصل
                                                                    قيمتها إلى
                                                                    (60,000)
                                                                    ستين ألف
                                                                    ريال أو أكثر
                                                                    أو ما
                                                                    يعادلها من
                                                                    العملات
                                                                    الأجنبية،
                                                                    أثناء قدومي
                                                                    إلى المملكة
                                                                    أو مغادرتي
                                                                    منها، كما
                                                                    أتعهد بأن
                                                                    ألتزم
                                                                    بالإقرار عن
                                                                    أي أمتعة
                                                                    ثمينة بصحبتي
                                                                    عند قدومي
                                                                    إلى المملكة
                                                                    واستعدادي
                                                                    لدفع الرسوم
                                                                    الجمركية
                                                                    والضرائب
                                                                    المستحقة
                                                                    عليها، وفي
                                                                    حال مخالفتي
                                                                    ذلك فإنه
                                                                    يعرضني
                                                                    للمساءلة
                                                                    القانونية
                                                                    وتطبيق ما
                                                                    تقضي به
                                                                    أنظمة
                                                                    المملكة
                                                                    بحقي.
                                                                </li>
                                                                <li>
                                                                    أقر بالعلم
                                                                    أن الأنظمة
                                                                    بالمملكة
                                                                    تجرم دفع أي
                                                                    مبلغ رشوة
                                                                    بغض النظر عن
                                                                    مقداره
                                                                    وتعتبر قضية
                                                                    جنائية تعرض
                                                                    ممارسها
                                                                    لعقوبة السجن
                                                                    أو دفع غرامة
                                                                    أو كليهما
                                                                    معًا.
                                                                </li>
                                                                <li>
                                                                    أقر وأتعهد
                                                                    مجددًا بأن
                                                                    جميع
                                                                    المعلومات
                                                                    التي دونتها
                                                                    صحيحة وأتحمل
                                                                    كامل
                                                                    المسؤولية
                                                                    عنها، وفي
                                                                    حال ثبوت
                                                                    خلاف ذلك -أو
                                                                    اتضح أنني
                                                                    مدرج على
                                                                    قائمة
                                                                    الممنوعين-
                                                                    فإنه سوف يتم
                                                                    رفض طلبي، أو
                                                                    إلغاء
                                                                    التأشيرة
                                                                    آليًا في حال
                                                                    حصولي عليها،
                                                                    أو عدم
                                                                    السماح لي من
                                                                    دخول المملكة
                                                                    العربية
                                                                    السعودية في
                                                                    حال كان لدي
                                                                    تأشيرة
                                                                    سارية، وأقر
                                                                    بحق السلطات
                                                                    السعودية في
                                                                    إعادتي من
                                                                    منفذ الدخول
                                                                    على حسابي
                                                                    الخاص وليس
                                                                    لي الحق في
                                                                    المطالبة
                                                                    بالتعويض.
                                                                </li>
                                                            </ol>
                                                        </div>

                                                        <div className="form-group">
                                                            <div className="row row-sign">
                                                                <label className="control-label col-md-4 col-sm-4 col-xs-4">
                                                                    الاســم :
                                                                </label>
                                                                <div className="col-md-4 col-sm-4 col-xs-4">
                                                                    {
                                                                        dummyCustomer.name_ar
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="row row-sign">
                                                                <label className="control-label col-md-4 col-sm-4 col-xs-4">
                                                                    التوقيع :
                                                                </label>
                                                                <div className="col-md-4 col-sm-4 col-xs-4"></div>
                                                            </div>
                                                            <div className="row row-sign">
                                                                <label className="control-label col-md-4 col-sm-4 col-xs-4">
                                                                    التاريخ :
                                                                </label>
                                                                <div className="col-md-4 col-sm-4 col-xs-4">
                                                                    {
                                                                        dummyCustomer.request_date
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>

                        <div className="page-break"></div>
                    </div>
                </div>
            </div>
            {/* @endforeach */}

            <script
                dangerouslySetInnerHTML={{
                    __html: `
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
          `,
                }}
            />
        </AppLayout>
    );
};

export default NetReservation;
