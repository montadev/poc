<?php

// src/EventSubscriber/Checkout/ShippingAddressSubscriber.php
declare(strict_types=1);

namespace App\EventSubscriber\Checkout;

use Sylius\Bundle\CoreBundle\Event\CheckoutTransitionEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class ShippingAddressSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        // Avant de finaliser la sélection shipping
        return [
            'sylius.order.pre_complete_select_shipping' => 'saveAddress',
        ];
    }

    public function saveAddress(CheckoutTransitionEvent $event): void
    {
        $order = $event->getSource();      // l’Order en cours
        $form = $event->getForm();        // le Formulaire complet

        // Récupère et assigne l’adresse
        $shippingAddress = $form->get('shippingAddress')->getData();
        $order->setShippingAddress($shippingAddress);
    }
}
