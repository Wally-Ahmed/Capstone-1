// components/MenuTitles.tsx
import { cookies } from 'next/headers';
import LayoutList from './LayoutList';
import { backendURL } from '@/public/config';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface MenuTitlesProps {
    activeLayoutId: string;
}



const MenuTitles: React.FC<MenuTitlesProps> = ({ activeLayoutId }) => {

    const cookie = cookies().get('token');


    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Restaurant Layouts</h1>
            <div className="container mx-auto">
                <LayoutList jwt={cookie.value} activeLayoutId={activeLayoutId} />
            </div>
        </div>
    );
};

export default MenuTitles;
