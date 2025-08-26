import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MouseEvent, useEffect, useState } from 'react';
import { formateInputAmount, removeCommaAmount } from '../utils/formatAmount';
import DropDownStayType from './components/DropDownStayType';
import validAmount from '../utils/isValidAmount';
import { rooms } from '../utils/const';
import handleEditCustomer from './actions/handleEditCustomer';
import { notify } from '../utils/toast';
import BtnLoader from '../components/BtnLoader';
import useLoadingBtn from '../hooks/useLoadingBtn';

export default function EditCustomer({
  id,
  room,
  amount,
  stay,
}: {
  id: string;
  room: number;
  amount: string;
  stay: string;
}) {
  const [editInfo, setEditInfo] = useState<{ room: number; amount: string }>({
    room,
    amount,
  });
  const { loading, setLoading } = useLoadingBtn();
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
  const validStayType = stayType.find((type) => type.checked);
  const validEdit = validAmount(
    validStayType,
    { price: rooms.find((r) => r.room === editInfo.room)?.price },
    removeCommaAmount(String(editInfo.amount))
  );

  useEffect(() => {
    setStayType((types) =>
      types.map((type) =>
        type.stay === stay ? { ...type, checked: true } : type
      )
    );
  }, [stay]);

  async function renderEditCustomer(e: MouseEvent<HTMLButtonElement>) {
    setLoading(true);
    e.preventDefault();
    const response = await handleEditCustomer(
      id,
      room,
      editInfo.room,
      removeCommaAmount(String(editInfo.amount)),
      validStayType?.stay || stay
    );
    setLoading(false);
    return notify(response?.message, 'register-customer', response.code);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>This can only be edited once</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3">
          <Input
            value={editInfo.room}
            max={24}
            onChange={(e) =>
              setEditInfo({ ...editInfo, room: parseInt(e.target.value) })
            }
            min={1}
            type="number"
            placeholder="Enter room number"
          />
          <Input
            value={editInfo.amount}
            onChange={(e) =>
              setEditInfo({
                ...editInfo,
                amount: formateInputAmount(e.target.value) as string,
              })
            }
            placeholder="Enter amount paid"
          />

          <DropDownStayType
            stayType={stayType}
            setStayType={setStayType}
            type={stayType.find((type) => type.checked)?.stay || stay}
          />
          <DialogFooter>
            <BtnLoader
              disabled={!validEdit || loading}
              loading={loading}
              action="Update"
              onClick={(e) => renderEditCustomer(e)}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
