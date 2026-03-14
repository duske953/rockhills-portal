'use client';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { notify } from '@/app/utils/toast';
import { FormEvent, useState } from 'react';
import handleDeregisterRoom from '../actions/handleDeregisterRoom';
import BtnLoader from '@/app/components/BtnLoader';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { LogOut } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { buttonVariants } from '@/app/components/ui/button';

export default function DeregisterRoom() {
  const [room, setRoom] = useState('');
  const { loading, setLoading } = useLoadingBtn();
  const [openModal, setOpenModal] = useState(false);
  const invalidNumber = !Number.isFinite(+room) || +room <= 0 || +room > 24;
  async function renderDeregisterRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (invalidNumber) return notify('Invalid room', 'de-register', 400);
    setLoading(true);
    const response = await handleDeregisterRoom(+room);
    setLoading(false);
    if (!response) return notify('Something went wrong', 'de-register', 500);
    if (response.code === 200) {
      setRoom('');
      setOpenModal(false);
    }
    return notify(response.message, 'de-register', response.code);
  }
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-12 px-6 rounded-2xl gap-3 font-black shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300',
          )}
        >
          <LogOut className="w-5 h-5 text-primary" />
          Deregister Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deregister?</DialogTitle>
          <DialogDescription>
            Please,ensure the room is vacant before proceeding
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={renderDeregisterRoom} className="flex flex-col gap-3">
          <Input
            value={room}
            type="number"
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter room number"
          />
          <BtnLoader
            loading={loading}
            disabled={loading || invalidNumber}
            action="Deregister"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
