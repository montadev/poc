<?php

declare(strict_types=1);

namespace App;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250502205532 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipment ADD pickup_point_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipment ADD CONSTRAINT FK_FD707B33682033F1 FOREIGN KEY (pickup_point_id) REFERENCES app_pickup_point (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_FD707B33682033F1 ON sylius_shipment (pickup_point_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points DROP FOREIGN KEY FK_PICKUP_POINT
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points DROP FOREIGN KEY FK_SHIPPING_METHOD
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points ADD CONSTRAINT FK_2AF1DC3419883967 FOREIGN KEY (method_id) REFERENCES sylius_shipping_method (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points ADD CONSTRAINT FK_2AF1DC34C028CEA2 FOREIGN KEY (point_id) REFERENCES app_pickup_point (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points RENAME INDEX idx_abc123 TO IDX_2AF1DC3419883967
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points RENAME INDEX idx_def456 TO IDX_2AF1DC34C028CEA2
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipment DROP FOREIGN KEY FK_FD707B33682033F1
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_FD707B33682033F1 ON sylius_shipment
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipment DROP pickup_point_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points DROP FOREIGN KEY FK_2AF1DC3419883967
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points DROP FOREIGN KEY FK_2AF1DC34C028CEA2
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points ADD CONSTRAINT FK_PICKUP_POINT FOREIGN KEY (point_id) REFERENCES app_pickup_point (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points ADD CONSTRAINT FK_SHIPPING_METHOD FOREIGN KEY (method_id) REFERENCES sylius_shipping_method (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points RENAME INDEX idx_2af1dc3419883967 TO IDX_ABC123
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sylius_shipping_method_pickup_points RENAME INDEX idx_2af1dc34c028cea2 TO IDX_DEF456
        SQL);
    }
}
