import { removeCommaAmount } from '@/app/utils/formatAmount';
import validAmount from '@/app/utils/isValidAmount';
import { ReactNode } from 'react';
import { FaNairaSign } from 'react-icons/fa6';

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
  return (
    <ul className="flex flex-col gap-3">
      {activeRoom.map(
        (room) =>
          room.checked && (
            <MetaData
              key={room.room}
              heading="Room Number"
              text={String(room.room)}
            />
          )
      )}

      {payment.map(
        (pay) =>
          pay.checked && (
            <MetaData
              key={pay.type}
              heading="Payment Type"
              text={String(pay.type)}
            />
          )
      )}

      {stayType.map(
        (stay) =>
          stay.checked && (
            <MetaData
              key={stay.stay}
              heading="Stay Type"
              text={String(stay.stay)}
            />
          )
      )}

      {validAmount(validStayType, validRoom, formatAmount) && (
        <MetaData
          key={roomMetaData.amount}
          heading="Amount"
          text={new Intl.NumberFormat().format(formatAmount)}
        >
          <FaNairaSign />
        </MetaData>
      )}

      {roomMetaData.customerName.length !== 0 && (
        <MetaData
          key={roomMetaData.customerName}
          heading="Customer's-Name"
          text={roomMetaData.customerName}
        />
      )}

      {isNumberValid.isValid && (
        <MetaData
          key={roomMetaData.customerNumber}
          heading="Customer's-Number"
          text={`0${roomMetaData.customerNumber}`}
        />
      )}
    </ul>
  );
}

function MetaData({
  heading,
  text,
  children,
}: {
  heading: string;
  children?: ReactNode;
  text: string | number;
}) {
  return (
    <li className="flex gap-3">
      <p>{heading}:</p>
      <p className="font-bold text-gray-600 flex items-center">
        {children}
        {text}
      </p>
    </li>
  );
}
