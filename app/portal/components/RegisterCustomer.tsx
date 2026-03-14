'use client';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ChangeEvent, useState } from 'react';
import DropDownRooms from './DropDownRooms';
import DropDownPayment from './DropDownPayment';
import DropDownStayType from './DropDownStayType';
import phone from 'phone';
import CustomerInformation from './CustomerInformation';
import moment from 'moment';
import handleRegisterCustomer from '../actions/handleRegisterCustomer';
import { MIN_FULL_TIME_AMOUNT, rooms } from '@/app/utils/const';
import validAmount from '@/app/utils/isValidAmount';
import { notify, toastConfirmAction } from '@/app/utils/toast';
import { toast } from 'sonner';
import {
  formateInputAmount,
  removeCommaAmount,
} from '@/app/utils/formatAmount';
import { User, Phone, Banknote, ClipboardCheck } from 'lucide-react';

export default function RegisterCustomer() {
  const [activeRoom, setActiveRoom] = useState(rooms);
  const [roomMetaData, setRoomMetaData] = useState({
    amount: '',
    customerName: '',
    customerNumber: 0,
  });
  const [payment, setPayment] = useState([
    {
      type: 'POS',
      checked: false,
    },
    {
      type: 'CASH',
      checked: false,
    },
  ]);

  const [stayType, setStayType] = useState([
    {
      stay: 'FULL-TIME',
      checked: false,
    },
    {
      stay: 'SHORT-REST',
      checked: false,
    },
  ]);

  const formatAmount = removeCommaAmount(roomMetaData.amount);
  function renderRoomMetaDataChange(
    e: ChangeEvent<HTMLInputElement>,
    type: string,
  ) {
    setRoomMetaData((data) => {
      return {
        ...data,
        [type]:
          type === 'amount'
            ? formateInputAmount(e.target.value)
            : e.target.value,
      };
    });
  }

  const isNumberValid = phone(
    `+234${String(roomMetaData.customerNumber).slice(0)}`,
  );

  function isDropDownValid(data: Array<any>) {
    return data.find((d) => d.checked === true);
  }

  const validRoom = isDropDownValid(activeRoom);
  const validPayment = isDropDownValid(payment);
  const validStayType = isDropDownValid(stayType);
  const validCustomerName = roomMetaData.customerName.length > 0;
  const validForm =
    !validAmount(validStayType, validRoom, formatAmount) ||
    !validCustomerName ||
    !validPayment ||
    !validStayType ||
    !validRoom ||
    !isNumberValid.isValid ||
    (validStayType.stay === 'FULL-TIME' && formatAmount < MIN_FULL_TIME_AMOUNT);

  async function renderRegisterCustomer() {
    const data = {
      room: validRoom.room,
      name: roomMetaData.customerName,
      amount: formatAmount,
      phoneNumber: `+234-${roomMetaData.customerNumber}`,
      stayType: validStayType.stay,
      paymentType: validPayment.type,
      checkInTime: moment().format('YYYY-MM h:mm:ss a'),
    };
    toast.dismiss('confirm');
    toast.loading('Registering...', {
      id: 'register-customer',
      position: 'top-right',
    });
    const response = await handleRegisterCustomer(data);

    if (response) {
      return notify(response.message, 'register-customer', response.code);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-8 text-left border-b pb-4">
            <ClipboardCheck className="text-primary w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                New Registration
              </h2>
              <p className="text-sm text-gray-500">
                Enter customer details to book a room
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase text-gray-500 ml-1">
                  Room Selection
                </label>
                <DropDownRooms
                  activeRoom={activeRoom}
                  setActiveRoom={setActiveRoom}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase text-gray-500 ml-1">
                  Payment Method
                </label>
                <DropDownPayment payments={payment} setPayment={setPayment} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase text-gray-500 ml-1">
                  Stay Duration
                </label>
                <DropDownStayType
                  setStayType={setStayType}
                  stayType={stayType}
                  type="Stay Type"
                />
              </div>
            </div>

            {/* Input Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-10 h-11 rounded-xl"
                    onChange={(e) =>
                      renderRoomMetaDataChange(e, 'customerName')
                    }
                    placeholder="Customer Name"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-10 h-11 rounded-xl"
                    type="number"
                    onChange={(e) =>
                      renderRoomMetaDataChange(e, 'customerNumber')
                    }
                    placeholder="Phone Number (e.g. 08012345678)"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Banknote className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-10 text-lg font-bold h-11 rounded-xl border-primary/20 bg-primary/5 focus:bg-white transition-colors"
                    value={roomMetaData.amount}
                    type="text"
                    onChange={(e) => renderRoomMetaDataChange(e, 'amount')}
                    placeholder="Charge Amount"
                  />
                  {validRoom && (
                    <div className="absolute right-3 top-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                      Std: ₦{new Intl.NumberFormat().format(validRoom.price)}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() =>
                    toastConfirmAction(
                      'Register customer',
                      renderRegisterCustomer,
                    )
                  }
                  disabled={validForm}
                  className="w-full h-11 uppercase font-black tracking-widest shadow-lg shadow-primary/20 rounded-xl"
                >
                  Register Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12">
        <CustomerInformation
          activeRoom={activeRoom}
          payment={payment}
          stayType={stayType}
          validStayType={validStayType}
          validRoom={validRoom}
          roomMetaData={roomMetaData}
          isNumberValid={isNumberValid}
        />
      </div>
    </div>
  );
}
