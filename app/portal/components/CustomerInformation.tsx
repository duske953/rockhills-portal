import { removeCommaAmount } from '@/app/utils/formatAmount';
import validAmount from '@/app/utils/isValidAmount';
import { ReactNode } from 'react';
import { FaNairaSign } from 'react-icons/fa6';
import {
  User,
  Phone,
  Bed,
  CreditCard,
  Clock,
  ReceiptText,
  CalendarCheck,
} from 'lucide-react';

interface StayType {
  stay: string;
  checked: boolean;
}

export default function CustomerInformation({
  activeRoom,
  payment,
  stayType,
  roomMetaData,
  isNumberValid,
  validStayType,
  validRoom,
}: {
  activeRoom: { room: number; checked: boolean }[];
  payment: { type: string; checked: boolean }[];
  validStayType: { stay: string; checked: boolean };
  validRoom: { room: number; checked: boolean; price: number };
  stayType: StayType[];
  roomMetaData: {
    amount: string;
    customerName: string;
    customerNumber: number;
  };
  isNumberValid: { isValid: boolean };
}) {
  const formatAmount = removeCommaAmount(roomMetaData.amount);

  const hasData =
    validRoom ||
    validStayType ||
    validCustomerName(roomMetaData.customerName) ||
    isNumberValid.isValid;

  function validCustomerName(name: string) {
    return name.trim().length > 0;
  }

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
        <ReceiptText className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-700 uppercase tracking-tight">
          Booking Summary
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeRoom.map(
          (room) =>
            room.checked && (
              <MetaData
                key={room.room}
                icon={<Bed className="w-4 h-4" />}
                heading="Room Number"
                text={`Room ${room.room}`}
              />
            ),
        )}

        {payment.map(
          (pay) =>
            pay.checked && (
              <MetaData
                key={pay.type}
                icon={<CreditCard className="w-4 h-4" />}
                heading="Payment Method"
                text={pay.type}
              />
            ),
        )}

        {stayType.map(
          (stay) =>
            stay.checked && (
              <MetaData
                key={stay.stay}
                icon={<Clock className="w-4 h-4" />}
                heading="Stay Type"
                text={stay.stay}
              />
            ),
        )}

        {validAmount(validStayType, validRoom, formatAmount) && (
          <MetaData
            key={roomMetaData.amount}
            icon={<CalendarCheck className="w-4 h-4" />}
            heading="Total Amount"
            text={new Intl.NumberFormat().format(formatAmount)}
          >
            <FaNairaSign className="text-xs mr-0.5 text-primary/80" />
          </MetaData>
        )}

        {validCustomerName(roomMetaData.customerName) && (
          <MetaData
            key={roomMetaData.customerName}
            icon={<User className="w-4 h-4" />}
            heading="Guest Name"
            text={roomMetaData.customerName}
          />
        )}

        {isNumberValid.isValid && (
          <MetaData
            key={roomMetaData.customerNumber}
            icon={<Phone className="w-4 h-4" />}
            heading="Contact Number"
            text={String(roomMetaData.customerNumber)}
          />
        )}
      </div>

      {!hasData && (
        <p className="text-slate-400 italic text-sm text-center py-4">
          No registration details entered yet...
        </p>
      )}
    </div>
  );
}

function MetaData({
  heading,
  text,
  icon,
  children,
}: {
  heading: string;
  icon: ReactNode;
  children?: ReactNode;
  text: string | number;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-slate-100 shadow-sm transition-all hover:border-slate-300">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {heading}
        </span>
      </div>
      <div className="font-semibold text-slate-700 flex items-center text-sm sm:text-base">
        {children}
        {text}
      </div>
    </div>
  );
}
