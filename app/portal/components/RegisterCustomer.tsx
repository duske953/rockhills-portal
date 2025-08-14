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
    type: string
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
    `+234${String(roomMetaData.customerNumber).slice(0)}`
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
      checkInTime: moment().format('h:mm:ss a'),
    };
    toast.dismiss('confirm');
    toast.loading('Registering...', {
      id: 'register-customer',
      position: 'top-right',
    });
    const response = await handleRegisterCustomer(data);

    return notify(response?.message, 'register-customer', response.code);
  }

  return (
    <>
      <div className="flex gap-6 max-md:flex-wrap">
        <DropDownRooms activeRoom={activeRoom} setActiveRoom={setActiveRoom} />
        <DropDownPayment payments={payment} setPayment={setPayment} />
        <DropDownStayType setStayType={setStayType} stayType={stayType} />
        <Input
          value={roomMetaData.amount}
          type="text"
          onChange={(e) => renderRoomMetaDataChange(e, 'amount')}
          placeholder="Enter Amount"
        />
      </div>

      <div className="flex flex-col gap-4 py-8">
        <Input
          onChange={(e) => renderRoomMetaDataChange(e, 'customerName')}
          placeholder="Customer's name"
        />
        <Input
          type="number"
          onChange={(e) => renderRoomMetaDataChange(e, 'customerNumber')}
          placeholder="Customer's number"
        />
        <Button
          onClick={() =>
            toastConfirmAction('Register customer', renderRegisterCustomer)
          }
          disabled={validForm}
          className="uppercase cursor-pointer"
        >
          Register
        </Button>
      </div>
      <CustomerInformation
        activeRoom={activeRoom}
        payment={payment}
        stayType={stayType}
        validStayType={validStayType}
        validRoom={validRoom}
        roomMetaData={roomMetaData}
        isNumberValid={isNumberValid}
      />
    </>
  );
}
