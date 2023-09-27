import { Navigate } from 'react-router-dom';
import MainLayout from 'components/Layout';
import { useAtomValue } from 'jotai';
import { authAtom } from 'atoms';

const ElementWrapper = ({ component: Component }) => {
  const { isLogged } = useAtomValue(authAtom);

  return isLogged ? (
    <MainLayout>
      <Component />
    </MainLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default ElementWrapper;
