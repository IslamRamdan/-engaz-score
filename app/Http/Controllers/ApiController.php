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
            'customer' => $customer,
            'group' => $group,
        ]);
    }
}
