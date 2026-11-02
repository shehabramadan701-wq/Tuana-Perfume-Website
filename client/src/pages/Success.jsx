import { Link, useParams } from 'react-router-dom';
import HeroBottle from '../components/HeroBottle';
import Ornament from '../components/Ornament';
import { useLang } from '../i18n/LanguageContext';

export default function Success() {
  const { id } = useParams();
  const { t } = useLang();

  return (
    <div className="page-center success">
      <div className="float"><HeroBottle size={220} framed /></div>
      <h1>{t('ok.title')}</h1>
      <Ornament />
      <p>{t('ok.text')}</p>
      <p className="order-no">{t('ok.order')}: <strong>#{id}</strong></p>
      <Link to="/" className="btn">{t('ok.back')}</Link>
    </div>
  );
}
