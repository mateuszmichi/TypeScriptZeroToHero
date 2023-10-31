// Enums

/**
 * Create enums for supported systems
 * Windows
 * Linux
 * MacOS
 */
function Exercise1() {
  enum OperatingSystem {
    Windows,
    Linux,
    MacOS,
  }

  enum NumberEnum {}
  enum StringEnum {}
}

/**
 * Replace the enum with 'as const' object and adjust code to the changes
 */
function Exercise2() {
  enum Customer {
    Private = "private",
    Business = "business",
    Internal = "internal",
  }

  type MonthlyPayment = {
    customerType: Customer;
    value: number;
  };

  const payments: MonthlyPayment[] = [
    {
      customerType: Customer.Private,
      value: 2400,
    },
    {
      customerType: Customer.Business,
      value: 10000,
    },
  ];

  function handlePayment(payment: MonthlyPayment) {
    if (payment.customerType === Customer.Private && payment.value > 10000) {
      return console.log("Need manual acceptance");
    }
    return console.log(`Providing payment for ${payment.customerType}`);
  }
}
