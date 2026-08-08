import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import {
    Users,
    Phone,
    MessageCircle,
    ArrowRight,
    CheckSquare,
    Square,
    Copy,
    Download,
    X,
    ChevronDown,
    MoreVertical,
    Eye,
    Edit,
    Wallet,
    MessageSquare,
    FileText,
    ChevronLeft,
    Contact,
    Printer,
    Activity,
    Stethoscope,
    FlaskConical,
    Sliders,
    UserMinus,
    UserX,
    Archive,
    FileHeart,
} from "lucide-react";
import { useForm } from "@inertiajs/react";

type MedicalStatus = "booked" | "fit" | "unfit" | null;
type LabStatus = "booked" | "positive" | "negative" | null;
type EnetStatus = "booked" | "not_booked" | null;
export interface CustomerGroupPivot {
    customer_id: number;
    group_id: number;
    medical_status: "booked" | "fit" | "unfit" | null;
    medical_token: string | null;
    lab_status: "booked" | "positive" | "negative" | null;
    enet_status: "booked" | "not_booked" | null;
    e_number: string | null;
    hospital_address: string | null;
    created_at?: string;
    updated_at?: string;
}
interface Bag {
    id: number;
    name: string;
}
type Customer = {
    id: number;
    name_ar: string;
    name_en: string | null;
    phone: string | null;
    whatsapp: string | null;
    nationality: string | null;
    birth_date: string | null;
    passport_number: string | null;
    passport_expiry_date: string | null;
    visa_number: string | null;
    e_number: string | null;
    gender: string | null;
    personal_image?: string | null;
    medical_status: MedicalStatus | null;
    lab_status: LabStatus | null;
    enet_status: EnetStatus | null;
    pivot?: CustomerGroupPivot;
    passport_issue_date: string | null;
    governorate: string | null;
    national_id: string | null;
    passport_issue_place: string | null;
    marital_status: string | null;
};

type Group = {
    id: number;
    name: string;
    notes: string | null;
};

type Props = {
    group: Group;
    customers: Customer[];
    sponsorName: string;
    issue_number: string;
    id_number: string;
    job: string;
    bags: Bag[]; // استقبال الحقائب هنا
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        role: "owner" | "admin" | "employee";
        is_active: boolean | number;
        engaz_email: string | null;
        engaz_password: string | null;
        created_at: string;
    };
    visa: {
        id: number;
        company_id: number;
        name: string;
        type: string;
        issue_number: string;
        consulate?: string;
        sponsor_id?: number; // المعرف الرقمي
        sponsor_name: string; // الاسم النصي
        id_number: string;
        job: string;
        issue_date_hijri?: string; // التاريخ الهجري
    };
    sponsor: {
        id: number;
        name: string;
        id_number: string;
        address: string;
        country: string;
    };
};

export default function Show({
    group,
    customers,
    sponsorName,
    issue_number,
    id_number,
    job,
    user,
    visa,
    sponsor,
    bags = [],
}: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [activeRowMenu, setActiveRowMenu] = useState<number | null>(null);
    const [isOperationsOpen, setIsOperationsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [statusModal, setStatusModal] = useState<null | Customer>(null);

    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [targetBagId, setTargetBagId] = useState<number | "">("");
    const { data, setData, put, processing, reset } = useForm<{
        medical_status: "booked" | "fit" | "unfit" | null;
        medical_token: string | null;
        lab_status: "booked" | "positive" | "negative" | string | null;
        enet_status: "booked" | "not_booked" | string | null;
        e_number: string | null;
        hospital_address: string | null;
    }>({
        medical_status: null,
        medical_token: "",
        lab_status: "",
        enet_status: "",
        e_number: "",
        hospital_address: "",
    });

    const isAllSelected =
        customers.length > 0 && selectedIds.length === customers.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(customers.map((c) => c.id));
        }
    };

    const handleBulkAddToBag = () => {
        if (selectedIds.length === 0 || !targetBagId) return;

        router.post(
            route("bags.add-customers-bulk"),
            {
                customer_ids: selectedIds,
                bag_id: targetBagId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setIsMoveModalOpen(false);
                    setIsOperationsOpen(false);
                    setTargetBagId("");
                    alert("تم إضافة العملاء إلى الحقيبة بنجاح!");
                },
            },
        );
    };

    const handleSelectRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkRemove = () => {
        if (selectedIds.length === 0) return;
        if (
            confirm(
                `هل أنت متأكد من إزالة ${selectedIds.length} عميل من هذه المجموعة؟`,
            )
        ) {
            router.delete(route("groups.remove-customers", group.id), {
                data: { customer_ids: selectedIds },
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setActiveRowMenu(null);
                },
            });
        }
    };

    const handleRemoveSingleCustomer = (customerId: number) => {
        if (!confirm("هل أنت متأكد من إزالة هذا العميل من المجموعة؟")) return;
        router.delete(route("groups.remove-customers", group.id), {
            data: { customer_ids: [customerId] },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds((prev) =>
                    prev.filter((id) => id !== customerId),
                );
                setActiveRowMenu(null);
            },
        });
    };

    const handleCopyImage = async (imageUrl: string) => {
        try {
            setIsCopying(true);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob(async (pngBlob) => {
                    if (pngBlob) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ [pngBlob.type]: pngBlob }),
                        ]);
                        alert("تم نسخ الصورة إلى الحافظة بنجاح!");
                    }
                }, "image/png");
            };
        } catch (err) {
            console.error("Failed to copy image: ", err);
            alert("فشل نسخ الصورة، قد يكون ذلك بسبب سياسات الحماية للمتصفح.");
        } finally {
            setIsCopying(false);
        }
    };

    const handleCopyText = async (text: string | null, fieldKey: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldKey);
            setTimeout(() => setCopiedField(null), 1500);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const calculateAge = (birthDate: string | null): number | null => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    const medicalStatusMap: Record<
        NonNullable<MedicalStatus> | "default",
        { label: string; color: "emerald" | "red" | "zinc" | "amber" }
    > = {
        booked: { label: "تم الحجز", color: "amber" },
        fit: { label: "لائق طبيًا (سليم)", color: "emerald" },
        unfit: { label: "غير لائق (غير سليم)", color: "red" },
        default: { label: "غير محدد", color: "zinc" },
    };

    // 3. خريطة المعامل
    const labStatusMap: Record<
        NonNullable<LabStatus> | "default",
        { label: string; color: "emerald" | "red" | "zinc" | "amber" }
    > = {
        booked: { label: "تم الحجز", color: "zinc" },
        positive: { label: "إيجابي", color: "red" },
        negative: { label: "سلبي", color: "emerald" },
        default: { label: "غير محدد", color: "zinc" },
    };

    // 4. خريطة إنجاز / النت
    const enetStatusMap: Record<
        NonNullable<EnetStatus> | "default",
        { label: string; color: "emerald" | "zinc" }
    > = {
        booked: { label: "تم الحجز", color: "emerald" },
        not_booked: { label: "غير محجوز", color: "zinc" },
        default: { label: "غير محجوز", color: "zinc" }, // في حال كانت القيمة null
    };

    const statusColorClasses: Record<string, string> = {
        emerald:
            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
        red: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
        zinc: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
        amber: "bg-amber-50 border-amber-200 text-amber-700",
    };

    // حجز النت
    const handleNetReservation = async () => {
        if (selectedIds.length === 0) return;

        // جلب كائنات العملاء المحددين كاملة
        const selectedCustomers = customers.filter((c) =>
            selectedIds.includes(c.id),
        );

        // مصفوفة لتجميع الأخطاء إن وجدت
        let validationErrors: { customerName: string; fields: string[] }[] = [];

        // فحص الأخطاء أولاً لجميع العملاء قبل البدء في الإرسال
        selectedCustomers.forEach((customer) => {
            let missingFields = [];
            if (!user?.engaz_email) missingFields.push("بريد إنجاز للموظف");
            if (!user?.engaz_password)
                missingFields.push("كلمة مرور إنجاز للموظف");
            if (!visa?.issue_number) missingFields.push("رقم مستند التأشيرة");
            if (!customer.name_ar) missingFields.push("الاسم العربي للعميل");
            if (!customer.name_en) missingFields.push("الاسم الإنجليزي للعميل");
            if (!customer.passport_number) missingFields.push("رقم الجواز");
            if (!customer.passport_issue_date)
                missingFields.push("تاريخ إصدار الجواز");
            if (!customer.passport_expiry_date)
                missingFields.push("تاريخ انتهاء الجواز");
            if (!customer.national_id)
                missingFields.push("رقم الهوية الوطنية/الرقم القومي");
            if (!sponsor?.name) missingFields.push("اسم الكفيل");

            if (missingFields.length > 0) {
                validationErrors.push({
                    customerName:
                        customer.name_ar ||
                        customer.name_en ||
                        `عميل رقم (${customer.id})`,
                    fields: missingFields,
                });
            }
        });

        // إذا كانت هناك أخطاء، اعرض البوب أب الجميل الخاص بالأخطاء وتوقف
        if (validationErrors.length > 0) {
            let htmlContent = `<div style="text-align: right; direction: rtl; font-family: inherit;">`;
            validationErrors.forEach((err) => {
                htmlContent += `
                <div style="margin-bottom: 15px; padding: 10px; border-right: 4px solid #ef4444; background-color: #fef2f2; border-radius: 4px;">
                    <strong style="color: #b91c1c; display: block; margin-bottom: 5px;">👤 ${err.customerName}</strong>
                    <span style="color: #374151; font-size: 0.95em;">${err.fields.join(" ، ")}</span>
                </div>
            `;
            });
            htmlContent += `</div>`;

            Swal.fire({
                title: "بيانات ناقصة!",
                html: htmlContent,
                icon: "error",
                confirmButtonText: "موافق",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        // استخدام حلقة for...of لضمان الإرسال بالترتيب (عميل تلو الآخر)
        for (const customer of selectedCustomers) {
            let NumberEntryDay = "90";
            let ResidencyInKSA = "120";
            const visaPeriod = visa?.type;

            if (visaPeriod === "work_temp_hajj_umrah") {
                NumberEntryDay = "90";
                ResidencyInKSA = "120";
            } else if (visaPeriod === "work") {
                NumberEntryDay = "90";
                ResidencyInKSA = "90";
            } else if (visaPeriod === "temporary_work") {
                NumberEntryDay = "365";
                ResidencyInKSA = "90";
            }

            const nameParts = (customer.name_en || "").trim().split(/\s+/);

            // بناء كائن البيانات للعميل الحالي
            const data = {
                email: user?.email || "",
                group: group?.id || "",
                customer_id: customer.id,
                UserName: user.engaz_email,
                Password: user.engaz_password,
                VisaKind:
                    {
                        work_temp_hajj_umrah:
                            "تأشيرة العمل المؤقت لخدمات الحج والعمرة",
                        work: "عمل",
                        temporary_work: "عمل مؤقت",
                    }[visa?.type] || "غير محدد",
                DocumentNumber: visa?.issue_number,
                NATIONALITY: "EGY",
                ResidenceCountry: "272",
                EmbassyCode: visa?.consulate || "غير محدد",
                NumberOfEntries: "0",
                NumberEntryDay: NumberEntryDay,
                ResidencyInKSA: ResidencyInKSA,
                imageUrl: `${window.location.origin}/storage/${customer.personal_image}`,
                AFIRSTNAME: customer.name_ar,
                AFATHER: customer.name_ar,
                AGGRAND: customer.name_ar,
                AFAMILY: customer.name_ar,
                EFIRSTNAME: nameParts[0] || "",
                EFATHER: nameParts.length > 2 ? nameParts[1] : "",
                EGRAND: nameParts.length > 3 ? nameParts[2] : "",
                EFAMILY:
                    nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
                PASSPORTnumber: customer.passport_number,
                PASSPORType: "1",
                PASSPORT_ISSUE_PLACE: "مصر",
                PASSPORT_ISSUE_DATE: customer.passport_issue_date,
                PASSPORT_EXPIRY_DATE: customer.passport_expiry_date,
                BIRTH_PLACE: customer.governorate,
                BIRTH_DATE: customer.birth_date,
                PersonId: customer.national_id,
                DEGREE: "-",
                DEGREE_SOURCE: "-",
                ADDRESS_HOME: "بحره",
                Personal_Email: "erfa20045@gmail.com",
                SPONSER_NAME: sponsor?.name,
                SPONSER_NUMBER: sponsor?.id_number || "غير متوفر",
                SPONSER_ADDRESS: sponsor?.address || "غير متوفر",
                SPONSER_PHONE: "01228815901",
                COMING_THROUGH: "2",
                ENTRY_POINT: "1",
                ExpectedEntryDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 2),
                ).toLocaleDateString("en-GB"),
                porpose: "",
                car_number: "SV123",
                RELIGION: "1",
                SOCIAL_STATUS: "2",
                Sex: customer.gender,
                JOB_OR_RELATION_Id: group?.notes || "غير محدد",
            };

            // 💡 1. تشغيل بوب أب اللودينج هنا قبل بدء طلب الـ API للعميل الحالي
            Swal.fire({
                title: "جاري حجز النت...",
                text: `يرجى الانتظار، يتم معالجة طلب العميل: ${customer.name_ar}`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading(); // تفعيل علامة التحميل (Spinner)
                },
            });

            try {
                const res = await fetch("http://localhost:3000/submit-all", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                let response = null;
                try {
                    response = await res.json();
                } catch (e) {}

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                // عند النجاح
                await new Promise((resolve) => {
                    Swal.fire({
                        title: "نجحت العملية!",
                        text: `تم إصدار طلب إنجاز للعميل: ${customer.name_ar}\nرقم الطلب: ${response?.appNo || "غير متوفر"}`,
                        icon: "success",
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        didClose: () => {
                            resolve(true);
                            router.reload();
                        }, // 💡 تم التعديل هنا
                    });
                });
            } catch (error) {
                // عند الفشل أو الخطأ
                await new Promise((resolve) => {
                    Swal.fire({
                        title: "فشلت العملية!",
                        text: `حدث خطأ أو لم يتم إصدار الطلب للعميل: ${customer.name_ar}`,
                        icon: "error",
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        didClose: () => {
                            resolve(true);
                            router.reload();
                        }, // 💡 تم التعديل هنا
                    });
                });
            }
        }
    };
    // حجز الكشف الطبي
    const handleMedicalBooking = async (customer: Customer) => {
        // Split the name by spaces
        const nameParts = customer.name_en
            ? customer.name_en.trim().split(/\s+/)
            : [];
        const firstName = nameParts[0] || null;
        const lastName =
            nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;

        function reverseDateFormat(dateStr: string | undefined | null) {
            if (!dateStr) return null;
            const cleanDate = dateStr.split("T")[0];
            const parts = cleanDate.split("-");
            if (parts.length !== 3) return null;
            const [year, month, day] = parts;
            return `${day}-${month}-${year}`;
        }

        // 1. تجميع البيانات القادمة من العميل والتي تحتاج إلى فحص
        const payload: any = {
            firstName: firstName,
            lastName: lastName,
            passportNumber: customer.passport_number || null,
            dateOfBirth: reverseDateFormat(customer.birth_date) || null,
            maritalStatus: "married",
            passportIssueDate:
                reverseDateFormat(customer.passport_issue_date) || null,
            passportIssuePlace: customer.passport_issue_place || null,
            passportExpiryDate:
                reverseDateFormat(customer.passport_expiry_date) || null,
            phone: customer.phone ? "+" + customer.phone : null,
            nationalId: customer.national_id || null,
            position: group?.notes || null,
        };

        // --- قاموس لترجمة أسماء الحقول للغة العربية لتظهر بشكل مفهوم للمستخدم ---
        const fieldLabels: { [key: string]: string } = {
            firstName: "الاسم الأول",
            lastName: "اسم العائلة",
            passportNumber: "رقم الجواز",
            dateOfBirth: "تاريخ الميلاد",
            maritalStatus: "الحالة الاجتماعية",
            passportIssueDate: "تاريخ إصدار الجواز",
            passportIssuePlace: "مكان إصدار الجواز",
            passportExpiryDate: "تاريخ انتهاء الجواز",
            phone: "رقم الهاتف",
            nationalId: "الرقم القومي",
            position: "الوظيفة / الملاحظات",
        };

        // --- فحص الحقول الفارغة المدخلة من قِبل المستخدم ---
        const missingFields: string[] = [];

        Object.keys(payload).forEach((key) => {
            const value = payload[key];
            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {
                missingFields.push(fieldLabels[key] || key);
            }
        });

        // --- إذا كانت هناك حقول ناقصة، اظهر الـ Popup واوقف العملية ---
        if (missingFields.length > 0) {
            const fieldsList = missingFields.join("، ");

            if (typeof Swal !== "undefined") {
                Swal.fire({
                    icon: "error",
                    title: "بيانات ناقصة!",
                    text: `يرجى استكمال البيانات التالية أولاً في ملف العميل: ${fieldsList}`,
                    confirmButtonText: "حسناً",
                    confirmButtonColor: "#d33",
                });
            } else {
                alert(
                    `يرجى استكمال البيانات التالية أولاً:\n${missingFields.join("\n")}`,
                );
            }

            return; // إيقاف الدالة فوراً ومنع إكمال الحجز
        }

        // 2. إضافة الحقول الثابتة والتلقائية بعد تخطي الفحص بنجاح
        payload.country = "EGY";
        payload.city = "87";
        payload.destinationCountry = "SA";
        payload.nationality = "55";
        payload.visaType = "wv";
        payload.gender = "male";
        payload.email = "erfa20045@gmail.com";
        payload.userEmail = "erfa20045@gmail.com";
        payload.customer_id = customer.id;
        payload.group_id = group.id;

        // 3. إرسال البيانات إلى السيرفر
        try {
            const res = await fetch("http://localhost:3000/api/wafid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const response = await res.json();
            router.reload();
        } catch (error) {
            console.error("Error during submission:", error);
            await new Promise<void>((resolve) => {
                Swal.fire({
                    title: "فشلت العملية!",
                    text:
                        "حدث خطأ في الشبكة أو اتصال السيرفر أثناء تنفيذ حجز الكشف الطبي للعميل: " +
                        (customer.name_ar || ""),
                    icon: "error",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        resolve();
                        router.reload();
                    }, // ⬅️ الإصلاح هنا
                });
            });
        }
    };

    // التحقق من الحالة الطبية
    const handleViewMedicalResult = async (customer: Customer) => {
        if (!customer.pivot?.medical_token) {
            Swal.fire({
                icon: "warning",
                title: "تنبيه",
                text: "لا يوجد رقم توكن طبي لهذا العميل.",
                confirmButtonColor: "#10b981",
            });
            return;
        }

        const baseUrl = "http://localhost:3000";
        const url = `${baseUrl}/check-medical/${customer.pivot.medical_token}/${group.id}`;

        Swal.fire({
            title: '<span style="font-family: inherit; font-size: 1.1rem;">جارٍ التحقق والترجمة...</span>',
            html: '<div style="color: #71717a; font-size: 0.9rem;">يرجى الانتظار قليلاً ريثما يتم جلب البيانات</div>',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: {
                popup: "rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl",
            },
        });

        try {
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok || !result.success) {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: "فشل التحقق",
                    text: result.message || "حدث خطأ في البيانات أو الرابط.",
                    confirmButtonColor: "#ef4444",
                    customClass: {
                        popup: "rounded-2xl",
                    },
                });
                return;
            }

            const translateText = async (text: string) => {
                if (!text) return "غير متوفر";
                try {
                    const res = await fetch(
                        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`,
                    );
                    const data = await res.json();
                    if (
                        data &&
                        data.responseData &&
                        data.responseData.translatedText
                    ) {
                        return data.responseData.translatedText;
                    }
                } catch (e) {
                    console.error("Translation error:", e);
                }
                return text;
            };

            const [arabicHospitalName, arabicAddress] = await Promise.all([
                translateText(result.hospitalName),
                translateText(
                    result.address
                        ? result.address.replace(/\s+/g, " ").trim()
                        : "",
                ),
            ]);

            Swal.close();

            // تحديد لون وشكل الحالة الطبية
            const getStatusBadge = (status: string) => {
                switch (status?.toLowerCase()) {
                    case "fit":
                        return `<span style="background-color: #d1fae5; color: #047857; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">لائق طبياً (Fit)</span>`;
                    case "unfit":
                        return `<span style="background-color: #fee2e2; color: #b91c1c; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">غير لائق (Unfit)</span>`;
                    case "booked":
                        return `<span style="background-color: #fef3c7; color: #b45309; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">تم الحجز (Booked)</span>`;
                    default:
                        return `<span style="background-color: #f4f4f5; color: #52525b; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">${status || "غير متوفر"}</span>`;
                }
            };

            Swal.fire({
                title: `<div style="font-size: 1.25rem; font-weight: 700; color: #18181b; margin-bottom: 4px;">نتيجة الكشف الطبي</div>`,
                html: `
                <div style="text-align: right; direction: rtl; display: flex; flex-direction: column; gap: 12px; padding: 8px 4px; font-family: inherit;">
                    
                    <!-- الحالة الطبية -->
                    <div style="background-color: #f9fafb; border: 1px solid #f4f4f5; padding: 12px 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.85rem; color: #71717a; font-weight: 600;">الحالة الطبية:</span>
                        <div>${getStatusBadge(result.status)}</div>
                    </div>

                    <!-- اسم المستشفى -->
                    <div style="background-color: #f9fafb; border: 1px solid #f4f4f5; padding: 12px 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px;">
                        <span style="font-size: 0.85rem; color: #71717a; font-weight: 600;">اسم المستشفى:</span>
                        <span style="font-size: 0.95rem; color: #18181b; font-weight: 700;">${arabicHospitalName}</span>
                    </div>

                    <!-- عنوان المستشفى -->
                    <div style="background-color: #f9fafb; border: 1px solid #f4f4f5; padding: 12px 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px;">
                        <span style="font-size: 0.85rem; color: #71717a; font-weight: 600;">العنوان:</span>
                        <span style="font-size: 0.85rem; color: #52525b; line-height: 1.5;">${arabicAddress || customer.pivot?.hospital_address || "غير متوفر"}</span>
                    </div>

                </div>
            `,
                confirmButtonText: "إغلاق",
                confirmButtonColor: "#059669",
                customClass: {
                    popup: "rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6",
                    confirmButton:
                        "rounded-xl px-5 py-2.5 text-sm font-medium transition-all shadow-sm",
                },
                didClose: () => {
                    router.reload();
                }, // ⬅️ الإصلاح هنا
            });
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "خطأ في الاتصال",
                text:
                    error?.message ||
                    "فشل الاتصال بالسيرفر، يرجى المحاولة مرة أخرى.",
                confirmButtonColor: "#ef4444",
                customClass: {
                    popup: "rounded-2xl",
                },
                didClose: () => {
                    router.reload();
                }, // ⬅️ الإصلاح هنا
            });
        }
    };

    // حجز المعامل
    const handleLabBooking = async (customer: Customer) => {
        // 1. تحديد الحقول المطلوبة للتحقق منها
        const requiredFields = [
            { key: "phone", label: "رقم الهاتف" },
            { key: "name_ar", label: "الاسم الكامل" },
            { key: "national_id", label: "الرقم القومي" },
            { key: "netNumber", label: "حجز النت" },
        ];

        // 2. التحقق من وجود الحقول
        const missingFields = requiredFields
            .filter((field) => {
                if (field.key === "netNumber") {
                    return !customer.pivot?.e_number;
                }
                return !customer[field.key as keyof Customer];
            })
            .map((field) => field.label);

        // 3. في حال وجود بيانات ناقصة، توقف وأظهر تنبيهاً
        if (missingFields.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "بيانات ناقصة",
                html: `يرجى إكمال البيانات التالية أولاً:<br><br><b>${missingFields.join("، ")}</b>`,
                confirmButtonText: "حسناً",
            });
            return;
        }

        // 4. تجهيز الـ payload
        const payload = {
            phone: customer.phone,
            fullName: customer.name_ar,
            nationalId: customer.national_id,
            email: "erfa20045@gmail.com",
            netNumber: customer.pivot?.e_number,
            passportNumber: customer.passport_number,
        };

        // 5. محاولة الإرسال للسيرفر
        try {
            Swal.fire({
                title: "جاري الحجز...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await fetch("http://localhost:3000/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok)
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
            Swal.close();
            const data = await res.json();
            console.log("Server response:", data);
        } catch (err) {
            Swal.close();
            console.error("Error during lab booking:", err);
        }
    };

    // حساب حالة انتهاء الجواز - يرجع تحذير لو أقل من سنة

    const getPassportWarning = (
        expiryDate?: string | null,
    ): { isWarning: boolean; label: string } | null => {
        if (!expiryDate) return null;

        const expiry = new Date(expiryDate);
        const now = new Date();
        const diffMs = expiry.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // منتهي بالفعل
        if (diffDays < 0) {
            const daysAgo = Math.abs(diffDays);
            if (daysAgo >= 365) {
                const years = Math.floor(daysAgo / 365);
                const months = Math.floor((daysAgo % 365) / 30);
                const label =
                    months > 0
                        ? `⚠️ انتهت صلاحية الجواز منذ ${years} سنة و ${months} شهر`
                        : `⚠️ انتهت صلاحية الجواز منذ ${years} سنة`;
                return { isWarning: true, label };
            }
            return {
                isWarning: true,
                label: `⚠️ انتهت صلاحية الجواز منذ ${daysAgo} يوم`,
            };
        }

        // باقي أقل من سنة
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            const days = diffDays % 30;
            const label =
                months > 0
                    ? `⚠️ متبقي على انتهاء الجواز: ${months} شهر و ${days} يوم`
                    : `⚠️ متبقي على انتهاء الجواز: ${days} يوم فقط`;
            return { isWarning: true, label };
        }

        // باقي أكتر من سنة - مفيش تنبيه
        return { isWarning: false, label: "" };
    };

    const StatusBadge = ({
        label,
        color,
    }: {
        label: string;
        color: string;
    }) => (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap ${statusColorClasses[color]}`}
        >
            {label}
        </span>
    );

    return (
        <AppLayout>
            <Head title={`مجموعة ${group.name}`} />

            <div
                className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6 antialiased text-zinc-800 dark:text-zinc-200"
                dir="rtl"
            >
                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                <Users className="w-6 h-6" />
                            </span>
                            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                                إدارة مجموعة: {group.name}
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mr-10">
                            استعراض والتحكم في العملاء المرتبطين بالمجموعة
                            الحالية
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto relative">
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsOperationsOpen(!isOperationsOpen)
                                }
                                disabled={selectedIds.length === 0}
                                className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-black text-sm rounded-2xl transition-all shadow-sm ${
                                    selectedIds.length > 0
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                                }`}
                            >
                                <span>العمليات</span>
                                <ChevronDown className="w-4 h-4" />
                                {selectedIds.length > 0 && (
                                    <span className="mr-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                                        {selectedIds.length}
                                    </span>
                                )}
                            </button>

                            {isOperationsOpen && selectedIds.length > 0 && (
                                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-30 overflow-hidden">
                                    <button
                                        onClick={handleBulkRemove}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-right text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <UserMinus className="w-4 h-4 text-red-500" />
                                        <span>ازالة العملاء من المجموعة</span>
                                    </button>
                                    <button
                                        onClick={() => setIsMoveModalOpen(true)}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-right text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800"
                                    >
                                        <Archive className="w-4 h-4 text-emerald-500" />
                                        <span>إضافة إلى حقيبة</span>
                                    </button>
                                    <button
                                        onClick={handleNetReservation}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-right text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800"
                                    >
                                        <Archive className="w-4 h-4 text-emerald-500" />
                                        <span>حجز نت</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link
                            href={route("groups.index")}
                            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition self-start sm:self-center"
                        >
                            <ArrowRight className="w-4 h-4" />
                            الرجوع للمجموعات
                        </Link>
                    </div>
                </div>

                {/* ===== SPONSOR / GROUP INFO CARD ===== */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
                    <h2 className="text-sm font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        بيانات الكفيل / المجموعة
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                key: "sponsorName",
                                label: "اسم الكفيل",
                                value: sponsorName,
                            },
                            {
                                key: "issue_number",
                                label: "رقم الإصدار",
                                value: issue_number,
                            },
                            {
                                key: "id_number",
                                label: "رقم الهوية",
                                value: id_number,
                            },
                            { key: "job", label: "المهنة", value: job },
                        ].map((field) => (
                            <div
                                key={field.key}
                                className="flex items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3"
                            >
                                <div className="min-w-0">
                                    <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                        {field.value || "—"}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleCopyText(field.value, field.key)
                                    }
                                    disabled={!field.value}
                                    className="shrink-0 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-emerald-600 hover:border-emerald-300 dark:hover:text-emerald-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="نسخ"
                                >
                                    {copiedField === field.key ? (
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== CUSTOMERS TABLE CARD ===== */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-visible">
                    <div className="w-full">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                    <th className="p-4 w-12 text-center">
                                        <button
                                            onClick={handleSelectAll}
                                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                        >
                                            {isAllSelected ? (
                                                <CheckSquare className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <Square className="w-5 h-5" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="p-4 min-w-[200px]">الاسم</th>
                                    <th className="p-4">السن</th>
                                    <th className="p-4">الهاتف / واتساب</th>
                                    <th className="p-4">رقم الجواز</th>
                                    <th className="p-4 text-center">
                                        الكشف الطبي
                                    </th>
                                    <th className="p-4 text-center">المعامل</th>
                                    <th className="p-4 text-center">إنجاز</th>
                                    <th className="p-4 w-20 text-center">
                                        العمليات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                                {customers.length > 0 ? (
                                    customers.map((c) => {
                                        const isSelected = selectedIds.includes(
                                            c.id,
                                        );
                                        const imageUrl = c.personal_image
                                            ? `/storage/${c.personal_image}`
                                            : null;
                                        const age = calculateAge(c.birth_date);
                                        const medical = c.pivot?.medical_status
                                            ? medicalStatusMap[
                                                  c.pivot.medical_status
                                              ]
                                            : medicalStatusMap["default"];

                                        const lab = c.pivot?.lab_status
                                            ? labStatusMap[c.pivot.lab_status]
                                            : labStatusMap["default"];

                                        const enet = c.pivot?.enet_status
                                            ? enetStatusMap[c.pivot.enet_status]
                                            : enetStatusMap["default"];

                                        const passportWarning =
                                            getPassportWarning(
                                                c.passport_expiry_date,
                                            );

                                        return (
                                            <tr
                                                key={c.id}
                                                title={
                                                    passportWarning?.isWarning
                                                        ? passportWarning.label
                                                        : undefined
                                                }
                                                className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors ${
                                                    isSelected
                                                        ? "bg-emerald-50/30 dark:bg-emerald-950/10"
                                                        : ""
                                                } ${
                                                    passportWarning?.isWarning
                                                        ? "bg-red-200 dark:bg-red-900/50 hover:bg-red-300 dark:hover:bg-red-900/70" // تغيير 50 إلى 200/900
                                                        : ""
                                                }`}
                                            >
                                                {/* Checkbox */}
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleSelectRow(
                                                                c.id,
                                                            )
                                                        }
                                                        className="text-zinc-400 hover:text-zinc-600 transition"
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <Square className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </td>

                                                {/* الاسم */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {imageUrl ? (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        imageUrl,
                                                                    )
                                                                }
                                                                className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition shrink-0 cursor-pointer shadow-sm"
                                                                title="اضغط لعرض وتنزيل الصورة"
                                                            >
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        c.name_ar
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-lg shrink-0 border border-zinc-200 dark:border-zinc-700 select-none">
                                                                {c.gender ===
                                                                "female"
                                                                    ? "🙋‍♀️"
                                                                    : "🙋‍♂️"}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                                {c.name_ar}
                                                            </p>
                                                            {c.name_en && (
                                                                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                                                    {c.name_en}
                                                                </p>
                                                            )}
                                                            <span className="inline-block text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded font-mono">
                                                                #{c.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* السن */}
                                                <td className="p-4 whitespace-nowrap">
                                                    {age !== null ? (
                                                        <div>
                                                            <p className="font-bold text-zinc-900 dark:text-white">
                                                                {age} سنة
                                                            </p>
                                                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                                                {new Date(
                                                                    c.birth_date!,
                                                                ).toLocaleDateString(
                                                                    "ar-EG",
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* الهاتف / واتساب */}
                                                <td className="p-4">
                                                    <div className="space-y-1.5">
                                                        {c.phone && (
                                                            <a
                                                                href={`tel:${c.phone}`}
                                                                className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition"
                                                                dir="ltr"
                                                                title="اتصال هاتفي"
                                                            >
                                                                <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                                                                <span className="font-mono">
                                                                    {c.phone}
                                                                </span>
                                                            </a>
                                                        )}
                                                        {c.whatsapp &&
                                                            c.whatsapp !==
                                                                c.phone && (
                                                                <a
                                                                    href={`https://wa.me/${c.whatsapp.replace(/\+/g, "")}`}
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                                                                    dir="ltr"
                                                                    title="مراسلة واتساب"
                                                                >
                                                                    <MessageCircle className="w-3 h-3 shrink-0" />
                                                                    <span className="font-mono">
                                                                        {
                                                                            c.whatsapp
                                                                        }
                                                                    </span>
                                                                </a>
                                                            )}
                                                        {!c.phone &&
                                                            !c.whatsapp && (
                                                                <span className="text-xs text-zinc-400">
                                                                    —
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* رقم الجواز */}
                                                <td className="p-4">
                                                    {c.passport_number ? (
                                                        <div>
                                                            <p className="font-mono font-bold text-zinc-900 dark:text-zinc-200">
                                                                {
                                                                    c.passport_number
                                                                }
                                                            </p>
                                                            <p
                                                                className={`text-[11px] ${
                                                                    passportWarning?.isWarning
                                                                        ? "text-red-600 dark:text-red-400 font-bold"
                                                                        : "text-zinc-400 dark:text-zinc-500"
                                                                }`}
                                                            >
                                                                ينتهي:{" "}
                                                                {c.passport_expiry_date
                                                                    ? new Date(
                                                                          c.passport_expiry_date,
                                                                      ).toLocaleDateString(
                                                                          "ar-EG",
                                                                      )
                                                                    : "—"}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* الكشف الطبي */}
                                                <td className="p-4 text-center">
                                                    {medical ? (
                                                        <StatusBadge
                                                            label={
                                                                medical.label
                                                            }
                                                            color={
                                                                medical.color
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* المعامل */}
                                                <td className="p-4 text-center">
                                                    {lab ? (
                                                        <StatusBadge
                                                            label={lab.label}
                                                            color={lab.color}
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* إنجاز */}
                                                <td className="p-4 text-center">
                                                    {enet ? (
                                                        <StatusBadge
                                                            label={enet.label}
                                                            color={enet.color}
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* العمليات */}
                                                <td className="p-4 text-center relative whitespace-nowrap overflow-visible">
                                                    <button
                                                        onClick={() =>
                                                            setActiveRowMenu(
                                                                activeRowMenu ===
                                                                    c.id
                                                                    ? null
                                                                    : c.id,
                                                            )
                                                        }
                                                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>

                                                    {activeRowMenu === c.id && (
                                                        <>
                                                            {/* خلفية لإغلاق القائمة عند الضغط في أي مكان خارجي */}
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() =>
                                                                    setActiveRowMenu(
                                                                        null,
                                                                    )
                                                                }
                                                            />

                                                            {/* القائمة الرئيسية */}
                                                            <div
                                                                className="absolute left-4 top-12 w-48 bg-white dark:bg-zinc-900
               border border-zinc-200 dark:border-zinc-700
               shadow-xl rounded-xl p-1
               z-[9999]"
                                                            >
                                                                {/* عرض */}
                                                                <button
                                                                    onClick={() => {
                                                                        setStatusModal(
                                                                            c,
                                                                        );

                                                                        setData(
                                                                            {
                                                                                medical_status:
                                                                                    (c
                                                                                        .pivot
                                                                                        ?.medical_status ??
                                                                                        null) as
                                                                                        | "booked"
                                                                                        | "fit"
                                                                                        | "unfit"
                                                                                        | null,
                                                                                medical_token:
                                                                                    c
                                                                                        .pivot
                                                                                        ?.medical_token ||
                                                                                    "",
                                                                                lab_status:
                                                                                    c
                                                                                        .pivot
                                                                                        ?.lab_status ||
                                                                                    "booked",
                                                                                enet_status:
                                                                                    c
                                                                                        .pivot
                                                                                        ?.enet_status ||
                                                                                    "not_booked",
                                                                                e_number:
                                                                                    c
                                                                                        .pivot
                                                                                        ?.e_number ||
                                                                                    "",
                                                                                hospital_address:
                                                                                    c
                                                                                        .pivot
                                                                                        ?.hospital_address ||
                                                                                    "",
                                                                            },
                                                                        );

                                                                        setActiveRowMenu(
                                                                            null,
                                                                        );
                                                                    }}
                                                                    className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-info-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                >
                                                                    <FileHeart className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />{" "}
                                                                    عرض الحالة
                                                                </button>
                                                                <Link
                                                                    // @ts-ignore
                                                                    href={route(
                                                                        "customers.show",
                                                                        c.id,
                                                                    )}
                                                                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-info-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                >
                                                                    <Eye className="w-4 h-4 text-info-500" />
                                                                    عرض
                                                                </Link>

                                                                {/* تعديل */}
                                                                <Link
                                                                    href={route(
                                                                        "customers.edit",
                                                                        c.id,
                                                                    )}
                                                                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                >
                                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                                    تعديل
                                                                </Link>

                                                                {/* الحسابات */}
                                                                <Link
                                                                    href={"/"}
                                                                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                >
                                                                    <Wallet className="w-4 h-4 text-zinc-400" />
                                                                    الحسابات
                                                                </Link>

                                                                {/* واتساب */}
                                                                {c.phone && (
                                                                    <a
                                                                        href={`https://wa.me/${c.phone}`}
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition"
                                                                    >
                                                                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                                                                        واتساب
                                                                    </a>
                                                                )}

                                                                <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>

                                                                {/* قائمة فرعية: تقارير */}
                                                                <div className="relative group/sub">
                                                                    <button className="w-full flex items-center justify-between gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                                        <div className="flex items-center gap-2">
                                                                            <FileText className="w-4 h-4 text-zinc-400" />
                                                                            <span>
                                                                                تقارير
                                                                            </span>
                                                                        </div>
                                                                        <ChevronLeft className="w-3 h-3 text-zinc-400 group-hover/sub:-translate-x-0.5 transition-transform" />
                                                                    </button>
                                                                    {/* محتوى القائمة الفرعية */}
                                                                    <div className="absolute left-full top-0 ml-1 hidden group-hover/sub:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl p-1 w-44 z-30">
                                                                        <a
                                                                            href={route(
                                                                                "nomination",
                                                                                {
                                                                                    customer_id:
                                                                                        c.id,
                                                                                    group_id:
                                                                                        group.id,
                                                                                },
                                                                            )} // تأكد من اسم متغير الـ group_id المتوفر لديك في الصفحة
                                                                            rel="noreferrer"
                                                                            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                        >
                                                                            <Contact className="w-4 h-4 text-zinc-400" />
                                                                            بطاقة
                                                                            الترشيح
                                                                        </a>
                                                                        <a
                                                                            href={route(
                                                                                "netReservation",
                                                                                {
                                                                                    customer:
                                                                                        c.id,
                                                                                    group: group.id,
                                                                                },
                                                                            )}
                                                                            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                                        >
                                                                            <Printer className="w-4 h-4 text-zinc-400" />
                                                                            طباعة
                                                                            طلب
                                                                            دخول
                                                                        </a>
                                                                    </div>
                                                                </div>

                                                                {/* قائمة فرعية: الكشف الطبي */}
                                                                <div className="relative group/sub">
                                                                    <button className="w-full flex items-center justify-between gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                                        <div className="flex items-center gap-2">
                                                                            <Activity className="w-4 h-4 text-zinc-400" />
                                                                            <span>
                                                                                الكشف
                                                                                الطبي
                                                                            </span>
                                                                        </div>
                                                                        <ChevronLeft className="w-3 h-3 text-zinc-400 group-hover/sub:-translate-x-0.5 transition-transform" />
                                                                    </button>
                                                                    <div className="absolute left-full top-0 ml-1 hidden group-hover/sub:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl p-1 w-44 z-30">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleMedicalBooking(
                                                                                    c,
                                                                                );
                                                                                setActiveRowMenu(
                                                                                    null,
                                                                                );
                                                                            }}
                                                                            className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-right"
                                                                        >
                                                                            <Stethoscope className="w-4 h-4 text-zinc-400" />
                                                                            حجز
                                                                            الكشف
                                                                            الطبي
                                                                        </button>
                                                                        {c.pivot
                                                                            ?.medical_token && (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        // بما أننا تحققنا بالخارج، التوكن هنا مضمون وجوده بنسبة 100%
                                                                                        const token =
                                                                                            c.pivot?.medical_token?.trimStart() ??
                                                                                            "";

                                                                                        if (
                                                                                            token
                                                                                        ) {
                                                                                            window.open(
                                                                                                `https://wafid.com/appointment/${token}/pay/`,
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-right"
                                                                                >
                                                                                    <Stethoscope className="w-4 h-4 text-zinc-400" />
                                                                                    دفع
                                                                                    رسوم
                                                                                    الكشف
                                                                                    الطبي
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleViewMedicalResult(
                                                                                            c,
                                                                                        )
                                                                                    }
                                                                                    className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-right"
                                                                                >
                                                                                    <Stethoscope className="w-4 h-4 text-zinc-400" />
                                                                                    <span>
                                                                                        عرض
                                                                                        نتيجة
                                                                                        الكشف
                                                                                        الطبي
                                                                                    </span>
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* قائمة فرعية: المعامل */}
                                                                <div className="relative group/sub">
                                                                    <button className="w-full flex items-center justify-between gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                                        <div className="flex items-center gap-2">
                                                                            <FlaskConical className="w-4 h-4 text-zinc-400" />
                                                                            <span>
                                                                                المعامل
                                                                            </span>
                                                                        </div>
                                                                        <ChevronLeft className="w-3 h-3 text-zinc-400 group-hover/sub:-translate-x-0.5 transition-transform" />
                                                                    </button>
                                                                    <div className="absolute left-full top-0 ml-1 hidden group-hover/sub:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl p-1 w-44 z-30">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleLabBooking(
                                                                                    c,
                                                                                );
                                                                                setActiveRowMenu(
                                                                                    null,
                                                                                );
                                                                            }}
                                                                            className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-right"
                                                                        >
                                                                            <FlaskConical className="w-4 h-4 text-emerald-500" />
                                                                            حجز
                                                                            المعامل
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* قائمة فرعية: الإجراءات */}
                                                                <div className="relative group/sub">
                                                                    <button className="w-full flex items-center justify-between gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                                        <div className="flex items-center gap-2">
                                                                            <Sliders className="w-4 h-4 text-zinc-400" />
                                                                            <span>
                                                                                الإجراءات
                                                                            </span>
                                                                        </div>
                                                                        <ChevronLeft className="w-3 h-3 text-zinc-400 group-hover/sub:-translate-x-0.5 transition-transform" />
                                                                    </button>
                                                                    <div className="absolute left-full top-0 ml-1 hidden group-hover/sub:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl p-1 w-44 z-30">
                                                                        {/* إزالة من المجموعة */}
                                                                        <button
                                                                            onClick={() => {
                                                                                setActiveRowMenu(
                                                                                    null,
                                                                                );
                                                                                handleRemoveSingleCustomer(
                                                                                    c.id,
                                                                                );
                                                                            }}
                                                                            className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-right"
                                                                        >
                                                                            <UserMinus className="w-4 h-4" />
                                                                            إزالة
                                                                            من
                                                                            المجموعة
                                                                        </button>

                                                                        {/* بلوك */}
                                                                        <button
                                                                            onClick={() => {
                                                                                setActiveRowMenu(
                                                                                    null,
                                                                                );
                                                                            }}
                                                                            className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-right"
                                                                        >
                                                                            <UserX className="w-4 h-4" />
                                                                            بلوك
                                                                        </button>

                                                                        {/* أرشفة */}
                                                                        <button
                                                                            onClick={() => {
                                                                                setActiveRowMenu(
                                                                                    null,
                                                                                );
                                                                            }}
                                                                            className="w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-right"
                                                                        >
                                                                            <Archive className="w-4 h-4" />
                                                                            أرشفة
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="p-12 text-center text-zinc-400 dark:text-zinc-500"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="w-8 h-8 text-zinc-300" />
                                                <p className="text-sm font-medium">
                                                    لا يوجد عملاء داخل هذه
                                                    المجموعة حالياً
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ===== IMAGE MODAL ===== */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedImage(null)}
                    />
                    <div className="bg-zinc-900 text-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10 border border-zinc-800">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                            <h3 className="text-xs font-bold tracking-wide text-zinc-400">
                                معاينة صورة العميل
                            </h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-zinc-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 flex items-center justify-center bg-zinc-950/40 border-b border-zinc-800">
                            <img
                                src={selectedImage}
                                alt="Customer Avatar Expanded"
                                className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
                            />
                        </div>
                        <div
                            className="p-4 bg-zinc-900/80 flex items-center justify-end gap-2"
                            dir="rtl"
                        >
                            <button
                                onClick={() => handleCopyImage(selectedImage)}
                                disabled={isCopying}
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition text-zinc-200 disabled:opacity-50"
                            >
                                <Copy className="w-4 h-4" />
                                {isCopying ? "جاري النسخ..." : "نسخ الصورة"}
                            </button>
                            <a
                                href={selectedImage}
                                download="customer_image.png"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition"
                            >
                                <Download className="w-4 h-4" />
                                تنزيل الصورة
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {statusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all">
                        {/* الهيدر */}
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                تحديث بيانات العميل الطبية
                            </h2>
                            <button
                                onClick={() => setStatusModal(null)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* الحقول الإدخالية */}
                        <div className="space-y-5">
                            {/* قسم الكشف الطبي */}
                            <div className="bg-zinc-50 dark:bg-zinc-850/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        الكشف الطبي
                                    </label>
                                    <select
                                        value={data.medical_status ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "medical_status",
                                                e.target.value === ""
                                                    ? null
                                                    : (e.target.value as
                                                          | "booked"
                                                          | "fit"
                                                          | "unfit"),
                                            )
                                        }
                                        className="w-full text-sm border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="">
                                            في انتظار الحجز
                                        </option>
                                        <option value="booked">تم الحجز</option>
                                        <option value="fit">لائق طبياً</option>
                                        <option value="unfit">غير لائق</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        رقم التوكن
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="أدخل رقم التوكن"
                                        value={data.medical_token || ""}
                                        onChange={(e) =>
                                            setData(
                                                "medical_token",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full text-sm border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-zinc-800 dark:text-zinc-200"
                                    />
                                </div>
                            </div>

                            {/* قسم المعامل والنت */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        المعامل
                                    </label>
                                    <select
                                        value={data.lab_status || "booked"}
                                        onChange={(e) =>
                                            setData(
                                                "lab_status",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full text-sm border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="booked">
                                            في انتظار النتيجة
                                        </option>
                                        <option value="negative">سلبي</option>
                                        <option value="positive">إيجابي</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        إنجاز (النت)
                                    </label>
                                    <select
                                        value={data.enet_status || "not_booked"}
                                        onChange={(e) =>
                                            setData(
                                                "enet_status",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full text-sm border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="not_booked">
                                            غير محجوز
                                        </option>
                                        <option value="booked">تم الحجز</option>
                                    </select>
                                </div>
                            </div>

                            {/* حقل E Number */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    E Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="E-00000000"
                                    value={data.e_number || ""}
                                    onChange={(e) =>
                                        setData("e_number", e.target.value)
                                    }
                                    className="w-full text-sm font-mono border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-zinc-800 dark:text-zinc-200 text-left"
                                    dir="ltr"
                                />
                            </div>

                            {/* حقل عنوان المستشفى الجديد */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    عنوان المستشفى
                                </label>
                                <textarea
                                    placeholder="أدخل عنوان المستشفى"
                                    rows={3} // عدد الأسطر الافتراضية
                                    value={data.hospital_address || ""}
                                    onChange={(e) =>
                                        setData(
                                            "hospital_address",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full text-sm border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-zinc-800 dark:text-zinc-200 resize-none"
                                />
                            </div>
                        </div>

                        {/* أزرار التحكم */}
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={() => setStatusModal(null)}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-all"
                            >
                                إلغاء
                            </button>

                            <button
                                disabled={processing}
                                onClick={() => {
                                    put(
                                        route(
                                            "groups.customers.status.update",
                                            [group.id, statusModal.id],
                                        ),
                                        {
                                            preserveScroll: true,
                                            onSuccess: () =>
                                                setStatusModal(null),
                                        },
                                    );
                                }}
                                className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-emerald-500/10 transition-all flex items-center gap-1.5"
                            >
                                {processing ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    "حفظ التعديلات"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MOVE/ADD TO bag MODAL ===== */}
            {isMoveModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
                        dir="rtl"
                    >
                        <button
                            onClick={() => setIsMoveModalOpen(false)}
                            className="absolute left-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                            <Archive className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                                إضافة {selectedIds.length} عميل إلى حقيبة
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                اختر الحقيبة المستهدفة:
                            </label>
                            <select
                                value={targetBagId}
                                onChange={(e) =>
                                    setTargetBagId(Number(e.target.value))
                                }
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-100"
                            >
                                <option value="">-- اختر حقيبة --</option>
                                {bags.map((bag) => (
                                    <option key={bag.id} value={bag.id}>
                                        {bag.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsMoveModalOpen(false)}
                                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleBulkAddToBag}
                                disabled={!targetBagId}
                                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                تأكيد الإضافة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
