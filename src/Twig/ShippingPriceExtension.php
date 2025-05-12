<?php
// src/Twig/ShippingPriceExtension.php
namespace App\Twig;

use Sylius\Component\Registry\ServiceRegistryInterface;
use Sylius\Component\Shipping\Model\ShippingMethodInterface;
use Sylius\Component\Shipping\Model\ShipmentInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class ShippingPriceExtension extends AbstractExtension
{
    public function __construct(
        private ServiceRegistryInterface $calculatorRegistry
    ) {
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('app_shipping_price', [$this, 'calculateShippingPrice']),
        ];
    }

    public function calculateShippingPrice(ShippingMethodInterface $method, ShipmentInterface $shipment): int
    {
        $calculator = $this->calculatorRegistry->get($method->getCalculator());
        return $calculator->calculate($shipment, $method->getConfiguration());
    }
}
