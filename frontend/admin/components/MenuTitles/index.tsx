// components/MenuTitles.tsx
import { cookies } from 'next/headers';
import MenuList from './MenuList';
import { backendURL } from '@/public/config';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface MenuTitlesProps {
}



const MenuTitles: React.FC<MenuTitlesProps> = ({ }) => {

    const cookie = cookies().get('token');

    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Restaurant Menus</h1>
            <div className="container mx-auto">
                <MenuList jwt={cookie.value} />
            </div>
        </div>
    );
};

export default MenuTitles;
