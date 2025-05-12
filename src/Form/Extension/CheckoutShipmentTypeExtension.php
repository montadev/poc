<?php
// src/Form/Extension/CheckoutShipmentTypeExtension.php
namespace App\Form\Extension;

use App\Entity\Shipping\Shipment;
use App\Entity\Shipping\ShippingMethod;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Entity\Shipping\PickupPoint;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CheckoutShipmentTypeExtension extends AbstractTypeExtension
{
    private $pickupPointRepository;

    public function __construct(\App\Repository\Shipping\PickupPointRepository $pickupPointRepository)
    {
        $this->pickupPointRepository = $pickupPointRepository;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // Add pickup point field as a mapped entity field
        $builder->add('pickupPointId', HiddenType::class, [
            'mapped' => false,
            'required' => false,
        ]);

        // Listen for form preprocessing to set initial values
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
            $shipment = $event->getData();
            $form = $event->getForm();

            // Set initial value if there's a pickup point already associated
            if ($shipment instanceof Shipment &&
                $shipment->getMethod() instanceof ShippingMethod &&
                $shipment->getMethod()->isPickupPointMethod() &&
                $shipment->getPickupPoint()) {

                $form->add('pickupPointId', HiddenType::class, [
                    'mapped' => false,
                    'required' => false,
                    'data' => $shipment->getPickupPoint()->getId()
                ]);
            }
        });

        // Process the submitted pickup point
        $builder->addEventListener(FormEvents::POST_SUBMIT, function (FormEvent $event) {
            $form = $event->getForm();
            $shipment = $form->getData();
            $pickupPointId = $form->get('pickupPointId')->getData();

            // Make sure we have a shipment
            if (!$shipment instanceof Shipment) {
                return;
            }

            if (!$shipment->getMethod() instanceof ShippingMethod) {
                return;
            }

            // Process pickup point selection based on shipping method type
            if (!$shipment->getMethod()->isPickupPointMethod()) {
                $shipment->setPickupPoint(null);
            } else if ($pickupPointId) {
                $pickupPoint = $this->pickupPointRepository->find($pickupPointId);
                if ($pickupPoint) {
                    $shipment->setPickupPoint($pickupPoint);
                }
            }
        });

        // We still need PRE_SUBMIT to handle form data before binding
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) {
            $data = $event->getData();
            $form = $event->getForm();

            // Transfer value from pickup point field to our mapped field
            if (isset($data['pickupPoint']) && $data['pickupPoint']) {
                $data['pickupPointId'] = $data['pickupPoint'];
                $event->setData($data);
            }
        });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'allow_extra_fields' => true,
            'validation_groups' => function (FormInterface $form) {
                $groups = ['sylius'];
                $shipment = $form->getData();

                if ($shipment instanceof Shipment &&
                    $shipment->getMethod() instanceof ShippingMethod &&
                    $shipment->getMethod()->isPickupPointMethod()) {
                    $groups[] = 'pickup_point_required';
                }

                return $groups;
            },
        ]);
    }

    public static function getExtendedTypes(): iterable
    {
        return [\Sylius\Bundle\CoreBundle\Form\Type\Checkout\ShipmentType::class];
    }
}
