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
import { User, Phone, Banknote } from 'lucide-react';

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
      checkInTime: moment().format('YYYY-MM-DD HH:mm:ss'),
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
        <div className="bg-white rounded-xl border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                New Registration
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Complete guest details to assign a room
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                  Room
                </label>
                <DropDownRooms
                  activeRoom={activeRoom}
                  setActiveRoom={setActiveRoom}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                  Payment
                </label>
                <DropDownPayment payments={payment} setPayment={setPayment} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
                  Stay Type
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
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-300" />
                  <Input
                    className="pl-10 h-11 rounded-xl border-slate-200"
                    onChange={(e) =>
                      renderRoomMetaDataChange(e, 'customerName')
                    }
                    placeholder="Guest Name"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-300" />
                  <Input
                    className="pl-10 h-11 rounded-xl border-slate-200"
                    type="number"
                    onChange={(e) =>
                      renderRoomMetaDataChange(e, 'customerNumber')
                    }
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Banknote className="absolute left-3 top-3.5 w-4 h-4 text-slate-300" />
                  <Input
                    className="pl-10 text-lg font-bold h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                    value={roomMetaData.amount}
                    type="text"
                    onChange={(e) => renderRoomMetaDataChange(e, 'amount')}
                    placeholder="Charge Amount"
                  />
                  {validRoom && (
                    <div className="absolute right-3 top-3 flex items-center px-2 py-0.5 rounded-lg bg-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest">
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
                  className="w-full h-11 uppercase font-bold tracking-widest rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Register Guest
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
