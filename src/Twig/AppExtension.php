<?php
// src/Twig/AppExtension.php

namespace App\Twig;

use App\Service\DistanceCalculator;
use Sylius\Component\Shipping\Model\ShippingMethodInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Sylius\Component\Addressing\Matcher\ZoneMatcherInterface;
use Sylius\Component\Core\Model\OrderInterface;

class AppExtension extends AbstractExtension
{
    private $distanceCalculator;
    private $pickupPointRepository;
    /**
     * @var ZoneMatcherInterface
     */
    private $zoneMatcher;

    public function __construct(DistanceCalculator $distanceCalculator, ZoneMatcherInterface $zoneMatcher, \App\Repository\Shipping\PickupPointRepository $pickupPointRepository)
    {
        $this->zoneMatcher = $zoneMatcher;
        $this->pickupPointRepository = $pickupPointRepository;
        $this->distanceCalculator = $distanceCalculator;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('calculate_distance', [$this, 'calculateDistance']),
            new TwigFunction('get_pickup_points', [$this, 'getPickupPoints']),
            new TwigFunction('get_pickup_points_for_method', [$this, 'getPickupPointsForMethod']),
            new TwigFunction('get_pickup_points_for_method_by_postalcode', [$this, 'getPickupPointsForMethodByPostalCode']),
        ];
    }

    public function calculateDistance($order, $point): float
    {
        return $this->distanceCalculator->calculate($order, $point);
    }
    public function getPickupPoints(): array
    {
        return $this->pickupPointRepository->findActive();
    }
    public function getPickupPointsForMethod($shippingMethod): array
    {
        if ($shippingMethod instanceof ShippingMethodInterface) {
            return $this->pickupPointRepository->findActiveByMethod($shippingMethod);
        }
        return $this->getPickupPoints();
    }
    public function getPickupPointsForMethodByPostalCode($shippingMethod, $postalCode): array
    {
        if ($shippingMethod instanceof ShippingMethodInterface) {
            return $this->pickupPointRepository->findActiveByMethodByPostalCode($shippingMethod, $postalCode);
        }

        return $this->getPickupPoints();
    }
}
