import ProductsSection from './ProductsSection'
import CampaignChart from './CampaignChart'
import ProgressCircles from './ProgressCircles'
import CampaignsRequirements from './CampaignsRequirements'
import MetricsAds from './MetricsAds'
import AgentsPlans from './AgentsPlans'

export default function VistaClientes() {
  return (
    <div className="space-y-6">
      <ProductsSection />

      <CampaignChart />

      <ProgressCircles />

      <CampaignsRequirements />

      <MetricsAds />

      <AgentsPlans />
    </div>
  )
}
