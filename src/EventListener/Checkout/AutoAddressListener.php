<?php

namespace App\EventListener\Checkout;

use Sylius\Component\Core\Model\OrderInterface;
use Sylius\Component\Core\Model\CustomerInterface;
use Symfony\Component\Workflow\Event\Event;

class AutoAddressListener
{
    public function onEnterShippingSelection(Event $event): void
    {
        $order = $event->getSubject();
        
        if (!$order instanceof OrderInterface) {
            return;
        }

        // Si l'ordre n'a pas d'adresse, utilisez l'adresse par défaut du client
        if (!$order->getShippingAddress() && $order->getCustomer()) {
            $customer = $order->getCustomer();
            
            if ($customer instanceof CustomerInterface && $customer->getDefaultAddress()) {
                $defaultAddress = clone $customer->getDefaultAddress();
                $order->setShippingAddress($defaultAddress);
                $order->setBillingAddress(clone $defaultAddress);
            }
        }
    }
}