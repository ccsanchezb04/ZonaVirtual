using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZonaVirtual.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFKsMedioPagoEstado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Transacciones_Estado",
                table: "Transacciones",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_Transacciones_MedioPago",
                table: "Transacciones",
                column: "MedioPago");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacciones_EstadosTransaccion_Estado",
                table: "Transacciones",
                column: "Estado",
                principalTable: "EstadosTransaccion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transacciones_MediosPago_MedioPago",
                table: "Transacciones",
                column: "MedioPago",
                principalTable: "MediosPago",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacciones_EstadosTransaccion_Estado",
                table: "Transacciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Transacciones_MediosPago_MedioPago",
                table: "Transacciones");

            migrationBuilder.DropIndex(
                name: "IX_Transacciones_Estado",
                table: "Transacciones");

            migrationBuilder.DropIndex(
                name: "IX_Transacciones_MedioPago",
                table: "Transacciones");
        }
    }
}
