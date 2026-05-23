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
    <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Booking Preview
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeRoom.map(
          (room) =>
            room.checked && (
              <MetaData
                key={room.room}
                icon={<Bed size={14} />}
                heading="Room"
                text={`Room ${room.room}`}
              />
            ),
        )}

        {payment.map(
          (pay) =>
            pay.checked && (
              <MetaData
                key={pay.type}
                icon={<CreditCard size={14} />}
                heading="Payment"
                text={pay.type}
              />
            ),
        )}

        {stayType.map(
          (stay) =>
            stay.checked && (
              <MetaData
                key={stay.stay}
                icon={<Clock size={14} />}
                heading="Stay"
                text={stay.stay}
              />
            ),
        )}

        {validAmount(validStayType, validRoom, formatAmount) && (
          <MetaData
            key={roomMetaData.amount}
            icon={<CalendarCheck size={14} />}
            heading="Amount"
            text={new Intl.NumberFormat().format(formatAmount)}
          >
            <FaNairaSign className="text-xs mr-0.5 opacity-40" />
          </MetaData>
        )}

        {validCustomerName(roomMetaData.customerName) && (
          <MetaData
            key={roomMetaData.customerName}
            icon={<User size={14} />}
            heading="Guest"
            text={roomMetaData.customerName}
          />
        )}

        {isNumberValid.isValid && (
          <MetaData
            key={roomMetaData.customerNumber}
            icon={<Phone size={14} />}
            heading="Contact"
            text={String(roomMetaData.customerNumber)}
          />
        )}
      </div>

      {!hasData && (
        <p className="text-slate-400 text-xs text-center py-4">
          Enter details to see preview...
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
    <div className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-slate-100">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-widest">
          {heading}
        </span>
      </div>
      <div className="font-bold text-slate-900 flex items-center text-sm">
        {children}
        {text}
      </div>
    </div>
  );
}
