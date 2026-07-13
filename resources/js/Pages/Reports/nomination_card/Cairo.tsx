import React, { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";

// ─── الأنواع (Types) - مطابقة لهيكل البيانات الفعلي القادم من الـ API ────────
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
    type?: string | null;
    issue_number: string | number | null; // رقم التأشيرة
    consulate?: string | null;
    sponsor_id?: number;
    issue_date_hijri?: string | null;
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
    notes?: string | null; // يُستخدم هنا كرقم السجل (بناءً على شكل القيمة "833101")
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

interface NominationCardProps {
    customer: Customer;
    jobs: Job[]; // إضافة التايب هنا
}

// ─── الصفحة ────────────────────────────────────────────────────────────────
export default function NominationCard({
    customer,
    jobs,
}: NominationCardProps) {
    // حالة "إعادة طباعة" ورقم الوكالة (بديل الـ prompt/confirm الأصلية)
    const [isReprint, setIsReprint] = useState(false);
    const [agencyNumber, setAgencyNumber] = useState("");

    // حالة التوقيع
    const [signatureText, setSignatureText] = useState("");
    const [savedSignature, setSavedSignature] = useState<string | null>(null);

    useEffect(() => {
        const agency = window.prompt("من فضلك أدخل رقم الوكالة:");
        if (agency) {
            setAgencyNumber(agency);
        }

        const wantsReprint = window.confirm(
            "هل تريد إعادة طباعة؟\nاضغط 'موافق' لإعادة الطباعة، أو 'إلغاء' لبطاقة عادية.",
        );
        setIsReprint(wantsReprint);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveSignature = () => {
        if (signatureText.trim() === "") {
            alert("من فضلك اكتب التوقيع");
            return;
        }
        setSavedSignature(signatureText);
    };

    // بما أن الراوت بيفلتر المجموعات بـ group_id، فأول عنصر في groups هو المجموعة المطلوبة
    const group = customer.groups?.[0];

    const sponsorName = group?.visa?.sponsor?.name ?? "-";
    const outgoingNumber = group?.visa?.sponsor?.id_number ?? "-";
    const registrationNumber = group?.visa?.issue_number ?? "-";
    // رقم الإنجاز الخاص بهذه المجموعة له الأولوية، وإلا نرجع لرقم العميل العام
    const eNumber = group?.pivot?.e_number ?? customer.e_number ?? "-";
    // ملاحظة: علاقة visaProfession غير محمّلة في الراوت الحالي (groups.visa.sponsor فقط)،
    // فحقل "المهنة" هيفضل فاضي لحد ما تضيف العلاقة دي للـ with() في الراوت
    const job = group?.notes ?? "-"; // Placeholder for job, since visaProfession is not loaded

    return (
        <AppLayout>
            <style>{`
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
            `}</style>

            <button
                className="nomination-print-button no-print"
                onClick={() => window.print()}
            >
                طباعة الاستمارة
            </button>

            <div className="nomination-page">
                <img
                    className="nomination-bg-image"
                    src="/img/Screenshot_1.png"
                    alt=""
                />
                <div className="nomination-content">
                    <div className="nomination-header">
                        {isReprint && (
                            <h1
                                style={{
                                    border: "3px solid black",
                                    width: "fit-content",
                                    padding: "5px",
                                    margin: "0 auto 5px",
                                    color: "red",
                                    fontWeight: "bold",
                                }}
                            >
                                اعاده طباعة
                            </h1>
                        )}

                        {!isReprint && <h1>استمارة ترشيح عمل</h1>}
                        <h2>
                            <u>بيانات صاحب العمل</u>
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            height: "164px",
                        }}
                    >
                        <table
                            className="nomination-top"
                            style={{
                                border: "7px solid black",
                                margin: "0 auto",
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            textAlign: "start",
                                            width: "23%",
                                        }}
                                    >
                                        الاسم
                                    </td>
                                    <td style={{ width: "50%" }}>
                                        {sponsorName}
                                    </td>
                                    <td
                                        rowSpan={4}
                                        style={{
                                            verticalAlign: "top",
                                            textAlign: "end",
                                        }}
                                    >
                                        رقم الصندوق :{" "}
                                        <span
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                textAlign: "center",
                                                fontSize: "35px",
                                            }}
                                        >
                                            418
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: "start" }}>
                                        رقم التأشيرة
                                    </td>
                                    <td
                                        style={{
                                            width: "60%",
                                            textAlign: "start",
                                            color: "red",
                                        }}
                                    >
                                        <span>رقم</span>: {outgoingNumber}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: "start" }}>
                                        رقم السجل
                                    </td>
                                    <td
                                        style={{
                                            width: "60%",
                                            textAlign: "start",
                                            color: "red",
                                        }}
                                    >
                                        <span>رقم</span>: {registrationNumber}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: "start" }}>
                                        رقم الوكالة
                                    </td>
                                    <td style={{ width: "60%" }}>
                                        {agencyNumber}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ width: "25%" }}>
                            <img
                                style={{
                                    maxWidth: "100%",
                                    borderRadius: "8px",
                                    height: "164px",
                                }}
                                src={
                                    customer.personal_image
                                        ? `/storage/${customer.personal_image}`
                                        : ""
                                }
                                alt=""
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                            marginBottom: "31px",
                        }}
                    >
                        <div className="nomination-barcode-note nomination-barcode-left">
                            باركود رقم التاشيرة
                        </div>
                        <div className="nomination-barcode-note nomination-barcode-right">
                            باركود رقم انجاز
                        </div>
                    </div>

                    <div className="nomination-section-title">
                        <h2>
                            <u>بيانات طالب العمل</u>
                        </h2>
                    </div>

                    <table className="nomination-applicant-data">
                        <tbody>
                            <tr>
                                <th>الاسم</th>
                                <th>رقم الجواز</th>
                                <th>رقم انجاز</th>
                                <th>المهنة</th>
                                <th>المؤهل</th>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    {customer.name_ar}
                                </td>
                                <td
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    {customer.passport_number}
                                </td>
                                <td
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    {eNumber}
                                </td>
                                <td
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        padding: "0",
                                    }}
                                    className="px-6 py-4 text-sm text-zinc-800 dark:text-zinc-200 max-w-xs truncate"
                                    title={
                                        jobs.find(
                                            (j: Job) =>
                                                j.Value ===
                                                customer.groups?.[0].notes,
                                        )?.Text ||
                                        customer.groups?.[0].notes ||
                                        ""
                                    }
                                >
                                    {jobs.find(
                                        (j: Job) =>
                                            j.Value ===
                                            customer.groups?.[0].notes,
                                    )?.Text || "---"}
                                </td>
                                <td
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                ></td>
                            </tr>
                        </tbody>
                    </table>

                    <table cellPadding={8} className="nomination-notes-table">
                        <tbody>
                            <tr>
                                <td rowSpan={13} style={{ width: "16%" }}>
                                    ملاحظات
                                </td>
                                <td></td>
                                <td>لا يوجد كشف طبي (معامل/ مستشفي خاص)</td>
                                <td></td>
                                <td>الصورة خطأ او غير موجودة</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>غير لائق بسبب .............</td>
                                <td></td>
                                <td>استمارة الترشيح غير موقعة او غير مختومة</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>لا يوجد مؤهل دراسي</td>
                                <td></td>
                                <td>المهنة مختلفة في الجواز عن التاشيرة</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>المؤهل (غير مطابق او غير مصدق)</td>
                                <td></td>
                                <td>صلاحيةالجواز اقل من 6 اشهر</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>مطلوب شهادة خبرة</td>
                                <td></td>
                                <td>الشركة موقوفة</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>لا توجد وكالة من صاحب العمل</td>
                                <td></td>
                                <td>يوجد خطا فى بيانات النت ......</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>يوجد اكثر من وكالة للتاشيرة</td>
                                <td></td>
                                <td>المهنة المطلوبة او الامر منفذ بالكامل</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    خطا في الفيش والتشبيه (الاسم / العلامة /
                                    الصلاحية)
                                </td>
                                <td></td>
                                <td>الجواز لا يوجد عليه لاصق المكتب</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>اقر العامل بالموافقة علي المهنة</td>
                                <td></td>
                                <td>لا توجد رخصة قيادة او غير مطابقة للمهنة</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>خطاب موافقة من صاحب العمل بالاستثناء</td>
                                <td></td>
                                <td> الاعتماد المهني</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>العمر اقل او اكثر من المطلوب (21 - 60)</td>
                                <td></td>
                                <td>الفحص المهني</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>الباركود يقرا خطا او غير صحيح</td>
                                <td></td>
                                <td>ملاحظة اخري ...................</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td> الخصائص الحيوية (البصمة)</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    <div
                        className="nomination-signature-section"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "20px",
                        }}
                    >
                        <div style={{ margin: 0, padding: 0 }}>
                            <span>المرفقات:</span>
                            {savedSignature ? (
                                <p
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        padding: 0,
                                        fontSize: "12px",
                                        fontWeight: 100,
                                    }}
                                >
                                    {savedSignature}
                                </p>
                            ) : (
                                <>
                                    <br />
                                    <textarea
                                        cols={30}
                                        rows={5}
                                        value={signatureText}
                                        onChange={(e) =>
                                            setSignatureText(e.target.value)
                                        }
                                    />
                                    <br />
                                    <button onClick={handleSaveSignature}>
                                        حفظ
                                    </button>
                                </>
                            )}
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                            }}
                        >
                            <div>أتعهد بصحة البيانات أعلاه</div>
                            <div>التوقيع المعتمد والختم</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
