<?php
// src/Service/DistanceCalculator.php

namespace App\Service;

use App\Entity\Shipping\PickupPoint;
use Sylius\Component\Core\Model\OrderInterface;

class DistanceCalculator
{
    public function calculate(OrderInterface $order, PickupPoint $point): float
    {
        // Implement your distance calculation logic here
        // This example uses simple coordinates comparison
        $lat1 = $order->getShippingAddress()->getLatitude();
        $lon1 = $order->getShippingAddress()->getLongitude();
        $lat2 = $point->getLatitude();
        $lon2 = $point->getLongitude();

        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        return $dist * 60 * 1.1515 * 1.609344; // Convert to kilometers
    }
}
