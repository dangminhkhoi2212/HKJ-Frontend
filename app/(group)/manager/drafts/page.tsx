'use client';

import { Button, Drawer } from 'antd';
import { Plus } from 'lucide-react';

import { Frame } from '@/shared/Frame';
import { useToggle } from '@uidotdev/usehooks';

import DraftList from './ui/DraftList';

const DraftPage = () => {
  const [on, toggle] = useToggle(false);
  return (
    <Frame
      title="Bản thảo mẫu"
      discription={
        <div className="flex flex-col text-sm text-gray-500 font-medium italic">
          <span>
            Việc tạo bản mẫu trước giúp bạn dễ dàng chọn công viêc khi tạo dự án
          </span>
        </div>
      }
      buttons={
        <Button
          type="primary"
          onClick={() => toggle(true)}
          icon={<Plus size={18} />}
        >
          Tạo bản mẫu
        </Button>
      }
    >
      <div>
        <Drawer title="Basic Drawer" onClose={() => toggle(false)} open={on}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
        <DraftList />
      </div>
    </Frame>
  );
};

export default DraftPage;
