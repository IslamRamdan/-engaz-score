<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Group;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    //

    public function sendEngaz(Request $request)
    {
        # code...
        $customer = Customer::find($request->customer_id);
        $group = Group::find($request->group);

        $group->customers()->updateExistingPivot($customer->id, [
            'enet_status' => 'booked',
            'e_number' => $request->e_number, // الرقم المرتجع من البوت (مثلاً appNo)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة النت بنجاح.',
        ]);
    }
    public function checkMedical(Request $request)
    {
        # code...
        $customer = Customer::find($request->customer_id);
        $group = Group::find($request->group_id);
        $group->customers()->updateExistingPivot($customer->id, [
            'medical_status' => 'booked',
            'medical_token' => $request->token_medical,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الفحص الطبي بنجاح.',
        ]);
    }
}
