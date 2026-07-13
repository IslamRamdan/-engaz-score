import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import AppLayout from "@/Layouts/AppLayout";

// ─── الأنواع (Types) - نفس هيكل البيانات الفعلي المستخدم في NominationCard ──
interface Sponsor {
    id: number;
    name: string | null;
    address?: string | null;
    id_number?: string | null;
    country?: string | null;
}

interface Visa {
    id: number;
    name: string | null;
    type?: string | null; // نوع التأشيرة
    issue_number: string | number | null;
    consulate?: string | null; // القسم القنصلي
    sponsor_id?: number;
    issue_date_hijri?: string | null; // بصيغة "DD/MM/YYYY" هجري جاهزة
    sponsor?: Sponsor | null;
}

interface GroupPivot {
    customer_id: number;
    group_id: number;
    medical_status?: string | null;
    medical_token?: string | null;
    lab_status?: string | null;
    enet_status?: string | null;
    e_number: string | null; // رقم انجاز الخاص بهذه المجموعة تحديدًا
}

interface Job {
    Value: string | number;
    Text: string;
}

interface CustomerGroup {
    id: number;
    name: string;
    visa_id?: number;
    notes?: string | null; // يُستخدم كمفتاح للبحث في قائمة jobs
    visa?: Visa | null;
    pivot?: GroupPivot | null;
}

interface Customer {
    id: number;
    name_ar: string;
    name_en?: string;
    passport_number: string | null;
    e_number: string | null; // رقم انجاز عام على مستوى العميل (احتياطي)
    personal_image: string | null;
    groups?: CustomerGroup[] | null;
}

interface JobNominationFormProps {
    customer: Customer;
    jobs: Job[];
}

// ===================== Component =====================

export default function JobNominationForm({
    customer,
    jobs,
}: JobNominationFormProps) {
    const visaBarcodeRef = useRef<SVGSVGElement>(null);
    const eNumberBarcodeRef = useRef<SVGSVGElement>(null);

    // بما أن الراوت بيفلتر المجموعات بـ group_id، فأول عنصر في groups هو المجموعة المطلوبة
    const group = customer.groups?.[0];

    const sponsorName = group?.visa?.sponsor?.name ?? "-";
    // نفس المنطق المستخدم في NominationCard لحقل "رقم التأشيرة"
    const visaNumber = group?.visa?.issue_number ?? "";
    const eNumber = group?.pivot?.e_number ?? customer.e_number ?? "";
    const consulateTitle = group?.visa?.consulate ?? "-";
    const visaTypeLabel = group?.visa?.type ?? "";
    const issueDateHijri = group?.visa?.issue_date_hijri ?? "-";
    const jobTitle = jobs.find((j) => j.Value === group?.notes)?.Text ?? "-";

    useEffect(() => {
        if (visaBarcodeRef.current) {
            JsBarcode(visaBarcodeRef.current, String(visaNumber || " "), {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 50,
                displayValue: false,
            });
        }
        if (eNumberBarcodeRef.current) {
            JsBarcode(eNumberBarcodeRef.current, eNumber || " ", {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 50,
                displayValue: false,
            });
        }
    }, [visaNumber, eNumber]);

    useEffect(() => {
        window.print();
    }, []);

    return (
        <AppLayout>
            <div
                dir="rtl"
                lang="ar"
                style={{ fontFamily: "Arial, sans-serif" }}
            >
                <style>{`
                body { margin: 0; padding: 0; direction: rtl; }
                tr td{
                font-size: 13px;
                font-weight: bold;
                }

                .jnf-page-wrapper { background-color: #f5f5f5; padding: 20px 0; }

                .jnf-container {
                    position: relative;
                    width: 210mm;
                    height: 297mm;
                    margin: 0 auto;
                    background: white;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .jnf-container img.jnf-bg { width: 100%; height: auto; display: block; }

                .jnf-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

                .jnf-field { position: absolute; font-size: 18px; font-weight: bold; color: black; }

                .jnf-box { display: inline-block; width: 30px; height: 30px; border: 2px solid black; background-color: transparent; vertical-align: middle; margin-right: 10px; }

                .jnf-form-header { position: absolute; left: 50%; top: 137px; transform: translateX(-50%); font-size: 22px; width: 100%; text-align: center; }

                .jnf-top-section { position: absolute; left: 50%; top: 172px; transform: translateX(-50%); display: flex; direction: ltr; justify-content: space-between; width: 90%; align-items: center; }

                .jnf-img img { width: 150px; height: 170px; }

                .jnf-info-group { display: flex; flex-direction: column; gap: 30px; align-items: center; width: 68%; }

                .jnf-pair-group { display: flex; gap: 30px; align-items: center; flex-direction: row-reverse; }

                .jnf-p { font-size: 13px; text-align: end; align-self: end; }

                .jnf-section-center { position: absolute; left: 50%; top: 326px; transform: translateX(-50%); width: 90%; text-align: center; }

                .jnf-flex { display: flex; gap: 20px; }

                .jnf-section-center svg { margin-right: 20px; width: 150px; height: 50px; }

                h2, h3, h4 { margin-top: 0; margin-bottom: 0; }

                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body, html { width: 210mm; height: 297mm; margin: 0; padding: 0; overflow: hidden; }
                    .jnf-page-wrapper { background: none; padding: 0; }
                    .jnf-container {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        box-shadow: none;
                        overflow: hidden;
                        page-break-after: avoid;
                        page-break-inside: avoid;
                    }
                    .jnf-container img.jnf-bg { width: 100%; height: auto; }
                    .jnf-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                    .jnf-field { font-size: 14px; font-weight: bold; }
                    .jnf-img img { width: 150px; height: 170px; }
                    .jnf-form-header, .jnf-top-section, .jnf-section-center { position: absolute !important; }
                    .no-print { display: none; }
                }
            `}</style>

                <div className="jnf-page-wrapper">
                    <div className="jnf-container">
                        <img
                            className="jnf-bg"
                            src="/img/Screenshot_1.png"
                            alt="صورة شخصية"
                        />

                        <div className="jnf-overlay">
                            {/* عنوان الاستمارة */}
                            <h2 className="jnf-form-header">
                                (استمارة ترشيح <span>{visaTypeLabel}</span> )
                            </h2>

                            {/* قسم الصورة والمرفقات */}
                            <div className="jnf-top-section">
                                <div className="jnf-img">
                                    <img
                                        src={`/storage/${customer.personal_image}`}
                                        alt="صورة شخصية"
                                    />
                                </div>

                                <div
                                    className="jnf-info-group"
                                    style={{ position: "relative" }}
                                >
                                    <h3
                                        style={{
                                            position: "absolute",
                                            top: "-21px",
                                            left: "27%",
                                            transform: "translateY(-50%)",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        مجانا
                                    </h3>
                                    <div className="jnf-pair-group">
                                        <h2 style={{ fontWeight: "bold" }}>
                                            <span className="jnf-box"></span>{" "}
                                            عدد المرفقات
                                        </h2>
                                        <h2 style={{ fontWeight: "bold" }}>
                                            <span className="jnf-box"></span>{" "}
                                            أصول المرفقات
                                        </h2>
                                    </div>
                                    <div
                                        className="jnf-p"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        <h3>
                                            سعادة رئيس القسم القنصلي في{" "}
                                            <span>{consulateTitle}</span>
                                        </h3>
                                        <h3>
                                            ...السلام عليكم ورحمة الله وبركاته
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* قسم المعلومات الشخصية */}
                            <div className="jnf-section-center font-bold">
                                <h3 style={{ textAlign: "right" }}>
                                    نرفق لكم بطيه الجواز الخاصة بالسيد/{" "}
                                    <span style={{ marginRight: 50 }}>
                                        {customer.name_ar}
                                    </span>
                                </h3>

                                <div
                                    className="jnf-flex"
                                    style={{ justifyContent: "space-around" }}
                                >
                                    <div>
                                        <h4>
                                            نأمل التكرم منكم بالتأشير له علي
                                            مهنة{" "}
                                            <span style={{ marginRight: 50 }}>
                                                {jobTitle}
                                            </span>
                                        </h4>
                                        <h4>
                                            بموجب التأشيرة رقم{" "}
                                            <span style={{ marginRight: 50 }}>
                                                {visaNumber || "-"}
                                            </span>
                                        </h4>
                                    </div>
                                    <div>
                                        <h4
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: 0,
                                                marginBottom: 0,
                                            }}
                                        >
                                            رقم التأشيرة
                                            <svg ref={visaBarcodeRef}></svg>
                                        </h4>
                                        <h4
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: 0,
                                                marginBottom: 0,
                                            }}
                                        >
                                            رقم الطلب
                                            <svg ref={eNumberBarcodeRef}></svg>
                                        </h4>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        padding: "10px 0",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        <div>
                                            وتاريخ
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: 150,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {issueDateHijri}
                                            </span>
                                        </div>
                                        <div style={{ width: "59%" }}>
                                            هـ والصادر
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: 200,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {sponsorName}
                                            </span>
                                        </div>
                                    </div>

                                    <p
                                        style={{
                                            marginTop: 5,
                                            textAlign: "center",
                                        }}
                                    >
                                        رقم انجاز
                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginRight: 60,
                                            }}
                                        >
                                            {eNumber || "-"}
                                        </span>
                                    </p>

                                    <p style={{ marginBottom: 0 }}>
                                        ويتعهد المكتب بأن المرشح يجيد القراءة
                                        والكتابة، وأن كافة البيانات المدونة
                                        والمرفقة صحيحة، وأن الباركود مطابق لرقم
                                        E Number
                                    </p>
                                    <p
                                        style={{
                                            textAlign: "center",
                                            margin: 0,
                                        }}
                                    >
                                        ومطابق لرقم التأشيرة وهذا تحت مسؤوليتنا.
                                    </p>

                                    <div
                                        className="jnf-flex"
                                        style={{
                                            justifyContent: "space-around",
                                        }}
                                    >
                                        <p>ختم المكتب</p>
                                        <p>توقيع المدير</p>
                                    </div>

                                    <p
                                        style={{
                                            fontWeight: "bold",
                                            margin: 0,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 18,
                                                marginLeft: 7,
                                            }}
                                        >
                                            راى القنصلية
                                        </span>
                                        بعد مراجعة جواز المرسل من قبلكم للقسم
                                        القنصلي، اتضح لنا أنه غير مستوفٍ للشروط،
                                        ومن أجل كل ذلك تم رفضه لذا
                                    </p>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        نأمل إحضار المطلوب وتصحيح الملاحظة،
                                        واعادته مع هذه الاستمارة وشكرا.
                                    </p>

                                    <div
                                        className="jnf-flex"
                                        style={{
                                            justifyContent: "space-around",
                                        }}
                                    >
                                        <h3>توقيع المراجع</h3>
                                        <h3>القنصل</h3>
                                    </div>

                                    <div style={{ padding: "15px 30px" }}>
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                direction: "rtl",
                                                fontFamily: "Arial",
                                                textAlign: "right",
                                                fontSize: 14,
                                            }}
                                        >
                                            <colgroup>
                                                <col style={{ width: 40 }} />
                                                <col />
                                                <col style={{ width: 40 }} />
                                                <col />
                                            </colgroup>
                                            <tbody>
                                                {[
                                                    [
                                                        "1",
                                                        "الصورة غير واضحة أو خاطئة",
                                                        "14",
                                                        "استمارة الترشيح غير موقعة أو مختومة",
                                                    ],
                                                    [
                                                        "2",
                                                        "المهنة مختلفة في الجواز عن التأشيرة",
                                                        "15",
                                                        "صلاحية الجواز أقل من 6 أشهر",
                                                    ],
                                                    [
                                                        "3",
                                                        "الشركة موقوفة",
                                                        "16",
                                                        "يوجد خطأ في بيانات النت",
                                                    ],
                                                    [
                                                        "4",
                                                        "المهنة المطلوبة أو الأمر المنفذ بالكامل",
                                                        "17",
                                                        "الجواز لا يوجد عليه لصق المكتب ----------",
                                                    ],
                                                    [
                                                        "5",
                                                        "لا توجد رخصة قيادة أو غير مطابقة للمهنة",
                                                        "18",
                                                        "لا يوجد كشف طبي (معامل / مستشفى خاص)",
                                                    ],
                                                    [
                                                        "6",
                                                        "اعتماد المهني",
                                                        "19",
                                                        "الفحص المهني",
                                                    ],
                                                    [
                                                        "7",
                                                        "رسوم التأشيرة غير مسددة ----------",
                                                        "20",
                                                        "غير لائق بسبب..........................",
                                                    ],
                                                    [
                                                        "8",
                                                        "لا يوجد مؤهل دراسي",
                                                        "21",
                                                        "المؤهل غير مطابق أو غير مصدق",
                                                    ],
                                                    [
                                                        "9",
                                                        "مطلوب شهادة خبرة",
                                                        "22",
                                                        "لا توجد وكالة من صاحب العمل",
                                                    ],
                                                    [
                                                        "10",
                                                        "يوجد أكثر من وكالة للتأشيرة",
                                                        "23",
                                                        "أخطاء في الاسم/العلامة/الصلاحية بالتشبيه أو الشيفرة",
                                                    ],
                                                    [
                                                        "11",
                                                        "إقرار العامل بالموافقة على المهنة",
                                                        "24",
                                                        "خطاب موافقة من صاحب العمل بالاستثناء",
                                                    ],
                                                    [
                                                        "12",
                                                        "العمر أقل أو أكثر من المطلوب (21 - 60)",
                                                        "25",
                                                        "الباركود غير واضح أو به خطأ",
                                                    ],
                                                    [
                                                        "13",
                                                        "ملاحظات أخرى",
                                                        "26",
                                                        "........................................................",
                                                    ],
                                                ].map((row, idx) => (
                                                    <tr key={idx}>
                                                        {row.map(
                                                            (cell, cellIdx) => (
                                                                <td
                                                                    key={
                                                                        cellIdx
                                                                    }
                                                                    style={{
                                                                        border: "2px solid black",
                                                                    }}
                                                                >
                                                                    {cell}
                                                                </td>
                                                            ),
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
