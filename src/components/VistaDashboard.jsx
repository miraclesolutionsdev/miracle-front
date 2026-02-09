import ResumenGeneral from './ResumenGeneral'
import ProductsSection from './ProductsSection'
import CampaignChart from './CampaignChart'
import ProgressCircles from './ProgressCircles'
import CampaignsRequirements from './CampaignsRequirements'
import MetricsAds from './MetricsAds'
import AgentsPlans from './AgentsPlans'

export default function VistaDashboard() {
  return (
    <div className="space-y-6">
      <ResumenGeneral />
      <ProductsSection />
      <CampaignChart />
      <ProgressCircles />
      <CampaignsRequirements />
      <MetricsAds />
      <AgentsPlans />
    </div>
  )
}
