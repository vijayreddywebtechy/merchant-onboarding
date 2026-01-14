import CompanyDetails from './CompanyDetails'
import CompanyFinancialInfo from './CompanyFinancialInfo'
import MarketingConsentForm from './MarketingConsentForm'
import CompanyBankingDetails from './CompanyBankingDetails'
import DeliveryDetails from './DeliveryDetails'
import CardMachineSummary from './CardMachineSummary'

type Props = {}

function CompanyInfo({}: Props) {
  return (
    <>
      <CompanyDetails />
      <CompanyFinancialInfo/>
      <MarketingConsentForm/>
      <CompanyBankingDetails/>
      <DeliveryDetails/>
      <CardMachineSummary/>
    </>
  )
}

export default CompanyInfo