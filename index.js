const Nightmare = require('nightmare')
const {select, evaluate, wait} = require("nightmare/lib/actions");
const nightmare = Nightmare({
    show: true,
    typeInterval: 300,
    // openDevTools: true,
})


const values = {
    amount: 3000,
    period: 48,
    project: 501,
    gender: "femme",
    name: 'Oriol',
    lastName: 'Escolar',
    lastName2: 'Cano',
    phone: "0666656464",
    email: "oriol.escolar@prestalo.com",
    dayOfBirth: "14",
    monthOfBirth: "Décembre",
    yearOfBirth: "1998",
    cityOfBirth: "Paris",
    birthCountry: "FRANCE",
    civilState: "Mariée",
    numberOfChildren: '5 ou +',
    cityOfResidence: 'Paris',
    address: "Avenue de l'Opera",
    livingSituation: 'Locataire',
    addressEntryYear: '2022',
    workSector: "Privé",
    profession: "Vendeuse - Caissière de magasin",
    contractType: "Intermittent du spectacle",
    currentJobStartMonth: "Janvier",
    currentJobStartYear: "2022",
    revenue: 2000,
    rent: 500,
    mortgage: 1000,
    carrefourMonthlyPendingCredits: 2000,
    carrefourMonthlyConsommationCredits: 1000,
    alimonity: 500,
    childCareFees: 200,
    bank: "AXA Banque",
    bankAccountYear: "1999",
    nonReimbursmentLoanRequest: true,
    conjoint: {
        gender: "femme",
        name: 'Manu',
        lastName: 'el',
        lastName2: 'Verga',
        dayOfBirth: "14",
        monthOfBirth: "Décembre",
        yearOfBirth: "1998",
        cityOfBirth: "Paris",
        birthCountry: "FRANCE",
        workSector: "Privé",
        profession: "Vendeuse - Caissière de magasin",
        contractType: "Intermittent du spectacle",
        currentJobStartMonth: "Janvier",
        currentJobStartYear: "2022",
        revenue: 3000

    }
}

const initShortFlow = async () =>{
    let text = await shortFlow(values)
    const params = text.split('\n')

    const result = {}

    for(const param of params) {
        const keyVal = param.split('\t')
        if(keyVal[1]) result[keyVal[0]] = keyVal[1]
    }
    console.log(result)
}

const initFullFlow = async () => {
    const result = await fullFlow(values)
    console.log(result)
}

const shortFlow = async (values) => {
    const tableSelector = "#remboursezSection"
    return await nightmare
        //First page
        .goto('https://www.carrefour-banque.fr/credit/pret-personnel/creditiz')
        .wait('#edit-votre-projet')
        .select('#edit-votre-projet', values.project)
        .wait(500)
        .insert('#amount', false)
        .wait(500)
        .insert('#amount', values.amount)
        .wait(500)
        .insert('#month', false)
        .wait(500)
        .insert('#month', values.period)
        .wait(500)
        .click('#simulez_btn')
        .wait(tableSelector)
        .evaluate(tableSelector => {
            return document.querySelector(tableSelector).innerText
        }, tableSelector)
        .end()
        .then(result => {
            return result
        })
        .catch(error => {
            console.error('Search failed:', error)
        })
}

const getProfessionSelector = (sector, gender) => {

    switch (sector) {
        case "Privé":
            return `.form-item-profession-SPR-${gender}`
            break;

        case "Public":
            return`.form-item-profession-SPU-${gender}`
            break;

        case "Retraité(e)":
            return`.form-item-profession-aut-${gender}`
            break;

        case "Agricole":
            return `.form-item-profession-SAG-${gender}`
            break;

        case "Artisans-commerçants":
            return `.form-item-profession-ACO-${gender}`
            break;

        case "Professions libérales":
            return `.form-item-profession-PLI-${gender}`
            break;

        case "Autres":
            return `.form-item-profession-AUT-${gender}`
            break;

    }

}

const getContractTypeSelector = (sector) => {

    switch (sector) {
        case "Privé":
            return `.form-item-contrat-prive`
            break;

        case "Public":
            return `.form-item-contrat-public`
            break;

        case "Agricole":
            return `.form-item-contrat-agricole`
            break;

    }

}

const getConjointProfessionSelector = (sector, gender) => {

    switch (sector) {
        case "Privé":
            return `.form-item-profession-SPR-conjoint-${gender}`
            break;

        case "Public":
            return`.form-item-profession-SPU-conjoint-${gender}`
            break;

        case "Retraité(e)":
            return`.form-item-profession-aut-conjoint-${gender}`
            break;

        case "Agricole":
            return `.form-item-profession-SAG-conjoint-${gender}`
            break;

        case "Artisans-commerçants":
            return `.form-item-profession-ACO-conjoint-${gender}`
            break;

        case "Professions libérales":
            return `.form-item-profession-PLI-conjoint-${gender}`
            break;

        case "Autres":
            return `.form-item-profession-AUT-conjoint-${gender}`
            break;

    }

}

const getConjointContractTypeSelector = (sector) => {

    switch (sector) {
        case "Privé":
            return `.form-item-contrat-prive-conjoint`
            break;

        case "Public":
            return `.form-item-contrat-public-conjoint`
            break;

        case "Agricole":
            return `.form-item-contrat-agricole-conjoint`
            break;

    }

}

const fullFlow = async(values) => {
    let professionSelector = getProfessionSelector(values.workSector, values.gender)
    let contractTypeSelector = getContractTypeSelector(values.workSector)


    const result = await nightmare
        //First page
        .goto('https://www.carrefour-banque.fr/credit/pret-personnel/creditiz')
        .wait('#edit-votre-projet')
        .select('#edit-votre-projet', values.project)
        .wait(500)
        .insert('#amount', false)
        .wait(500)
        .insert('#amount', values.amount)
        .wait(500)
        .insert('#month', false)
        .wait(500)
        .insert('#month', values.period)
        .wait(500)
        .click('#simulez_btn')
        .wait('#remboursezSection')
        .click('#remboursezSection .demande_button')
        .wait("#edit-civilite")
        .click(`#edit-civilite-${values.gender === 'homme'? "monsieur" : "madame"}`)
        .wait(500)
        .insert('#edit-nom', values.name)
        .insert('#edit-nom-jeune-fille', values.lastName)
        .insert('#edit-prenom', values.lastName2)
        .wait(500)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(500)
        .insert('#edit-email', values.email)
        .insert('#edit-mobile', values.phone)
        .wait(1500)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(1000)
        .evaluate((values) => {
            //Day of birth
            Array.from(document.querySelector(".form-item-date-naissance-select-day")
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.dayOfBirth)[0]
                .click()

            //Month of birth
            Array.from(document.querySelector(".form-item-date-naissance-select-month")
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.monthOfBirth)[0]
                .click()

            //Year of birth
            Array.from(document.querySelector(".form-item-date-naissance-select-year")
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.yearOfBirth)[0]
                .click()

        }, values)
        .evaluate((values) => {
            if (values.birthCountry !== "FRANCE") {
                Array.from(document.querySelector(".naissance-pays")
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.birthCountry)[0]
                    .click()

            }
        }, values)
        .wait(1000)
        .insert('#ville_naissance', values.cityOfBirth)
        .wait(1000)
        .evaluate((values) => {
            if (values.birthCountry === "FRANCE") {
                document.querySelector(".ui-autocomplete")
                    .querySelector('a')
                    .click()

            }
        }, values)
        .wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(1000)
        .evaluate((values) => {
            Array.from(document.querySelector(`.form-item-etat-civil-${values.gender}`)
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.civilState)[0]
                .click()

        }, values)
        .evaluate((values) => {
            Array.from(document.querySelector('.form-item-nombre-enfants')
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.numberOfChildren)[0]
                .click()

        }, values)
        .wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait('#ville')
        .wait(1000)
        .insert('#ville', values.cityOfResidence)
        .wait(1000)
        .evaluate(() => {
            Array.from(document.querySelectorAll(".ui-autocomplete"))
                .filter(el => el.offsetParent)[0]
                .querySelector('a')
                .click()

        })
        .wait()
        .insert('#adresse', values.address)
        .evaluate((values) => {
            Array.from(document.querySelector(`.form-item-mode-habitation-${values.gender}`)
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.livingSituation)[0]
                .click()

        }, values)
        .evaluate((values) => {
            Array.from(document.querySelector('.form-item-annee-entree-logement-year')
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.addressEntryYear)[0]
                .click()

        }, values)
        .wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(".form-item-secteur-activite")
        .evaluate((values) => {
            Array.from(document.querySelector('.form-item-secteur-activite')
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.workSector)[0]
                .click()

        }, values)
        .wait(1000)
        .evaluate(({values, professionSelector}) => {
            Array.from(document.querySelector(professionSelector)
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.profession)[0]
                .click()

        }, {values, professionSelector})
        .wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(".form-item-date-employeur-month")
        .evaluate((values) => {
            Array.from(document.querySelector('.form-item-date-employeur-month')
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.currentJobStartMonth)[0]
                .click()

        }, values)
        .wait(".form-item-date-employeur-year")
        .evaluate((values) => {
            Array.from(document.querySelector('.form-item-date-employeur-year')
                .querySelectorAll('span'))
                .filter(span => span.innerText === values.currentJobStartYear)[0]
                .click()

        }, values)
        .wait(1000)
        .evaluate((values, contractTypeSelector) => {
            const select = document.querySelector(contractTypeSelector)
            let selectedOption =  Array.from(select.querySelectorAll('span'))
                .filter(span => span.innerText === values.contractType)

            if(selectedOption.length === 0) {
                selectedOption = Array.from(select.querySelectorAll('span'))
                    .filter(span => span.innerText === "Autre")
            }

            selectedOption[0].click()

            if(selectedOption[0].innerText === 'Autre') {
                let altSelector = ''

                if(values.workSector === "Privé"){
                    altSelector = '.contrat_autre_selection'
                }

                if(values.workSector === "Agricole") {
                    altSelector = '.contrat_autre_agricole_selection'
                }

                Array.from(document.querySelector(altSelector)
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.contractType)[0]
                    .click()

            }

        }, values, contractTypeSelector)
        .wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(1000)
    if(values.conjoint && (values.civilState === "Mariée" || values.civilState === "PACS" || values.civilState === "Vie maritale/ Concubinage") ) {
        let conjointProfessionSelector = getConjointProfessionSelector(values.conjoint.workSector, values.conjoint.gender)
        let conjointContractTypeSelector = getConjointContractTypeSelector(values.conjoint.workSector)

        nightmare.click(`#edit-civilite-conjoint-${values.conjoint.gender === 'homme'? "monsieur" : "madame"}`)
            .wait(500)
            .insert('#edit-nom-conjoint', values.conjoint.name)
            .insert('#edit-nom-jeune-fille-conjoint', values.conjoint.lastName)
            .insert('#edit-prenom-conjoint', values.conjoint.lastName2)
            .wait(1000)
            .evaluate(() => {
                //CLICK CONTINUE
                const actions = document.querySelector(".actions")
                actions.querySelector('a')
                    .click()
            })

            .evaluate((values) => {
                //Day of birth
                Array.from(document.querySelector(".form-item-date-naissance-conjoint-select-day")
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.dayOfBirth)[0]
                    .click()

                //Month of birth
                Array.from(document.querySelector(".form-item-date-naissance-conjoint-select-month")
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.monthOfBirth)[0]
                    .click()

                //Year of birth
                Array.from(document.querySelector(".form-item-date-naissance-conjoint-select-year")
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.yearOfBirth)[0]
                    .click()

            }, values)
            .evaluate((values) => {
                if (values.conjoint.birthCountry !== "FRANCE") {
                    Array.from(document.querySelector(".form-item-pays-naissance-conjoint")
                        .querySelectorAll('span'))
                        .filter(span => span.innerText === values.conjoint.birthCountry)[0]
                        .click()

                }
            }, values)
            .wait(1000)
            .insert('#ville_naissance_conjoint', values.conjoint.cityOfBirth)
            .wait(1500)
            .evaluate((values) => {
                if (values.conjoint.birthCountry === "FRANCE") {
                    Array.from(document.querySelectorAll(".ui-autocomplete"))
                        .filter((el) => el.offsetParent)[0]
                        .querySelector('a')
                        .click()

                }
            }, values)
            .wait(1000)
            .evaluate(() => {
                //CLICK CONTINUE
                const actions = document.querySelector(".actions")
                actions.querySelector('a').click()
            })
            .wait(".form-item-secteur-activite-conjoint")
            .evaluate((values) => {
                Array.from(document.querySelector('.form-item-secteur-activite-conjoint')
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.workSector)[0]
                    .click()

            }, values)
            .wait(1000)
            .evaluate(({values, conjointProfessionSelector}) => {
                Array.from(document.querySelector(conjointProfessionSelector)
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.profession)[0]
                    .click()

            }, {values, conjointProfessionSelector})
            .wait(1000)
            .evaluate(() => {
                //CLICK CONTINUE
                const actions = document.querySelector(".actions")
                actions.querySelector('a').click()
            })
            .wait(1000)
            .wait(".form-item-date-employeur-month")
            .evaluate((values) => {
                Array.from(document.querySelector('.form-item-date-employeur-conjoint-month')
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.currentJobStartMonth)[0]
                    .click()

            }, values)
            .wait(".form-item-date-employeur-year")
            .evaluate((values) => {
                Array.from(document.querySelector('.form-item-date-employeur-conjoint-year')
                    .querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.currentJobStartYear)[0]
                    .click()

            }, values)
            .wait(1000)
            .evaluate((values, conjointContractTypeSelector) => {
                const select = document.querySelector(conjointContractTypeSelector)
                let selectedOption =  Array.from(select.querySelectorAll('span'))
                    .filter(span => span.innerText === values.conjoint.contractType)

                if(selectedOption.length === 0) {
                    selectedOption = Array.from(select.querySelectorAll('span'))
                        .filter(span => span.innerText === "Autre")
                }

                selectedOption[0].click()

                if(selectedOption[0].innerText === 'Autre') {
                    let altSelector = ''

                    if(values.conjoint.workSector === "Privé"){
                        altSelector = '.contrat_autre_selection_conjoint'
                    }

                    if(values.conjoint.workSector === "Agricole") {
                        altSelector = '.contrat_autre_agricole_selection_conjoint'
                    }

                    Array.from(document.querySelector(altSelector)
                        .querySelectorAll('span'))
                        .filter(span => span.innerText === values.conjoint.contractType)[0]
                        .click()

                }

            }, values, conjointContractTypeSelector)
            .evaluate(() => {
                //CLICK CONTINUE
                const actions = document.querySelector(".actions")
                actions.querySelector('a').click()
            })
            .wait(1000)
            .insert('#edit-revenu-conjoint', values.conjoint.revenue)
    }

    nightmare.insert('#edit-revenu',values.revenue)

    if(
        values.livingSituation === 'Locataire' ||
        values.livingSituation === 'Logée par la famille' ||
        values.livingSituation === "Logée par l' employeur" ||
        values.livingSituation === "Dans un autre cas") {

            nightmare.insert('#edit-montant-loy', values.rent || 0)
    }

    if(
        values.livingSituation === 'Accédant à la propriété' ||
        values.livingSituation === 'Propriétaire') {

            nightmare.insert('#edit-montant-loy', values.mortgage || 0)
    }
    nightmare.wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })
        .wait(1000)

    if (values.carrefourMonthlyPendingCredits) {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-cec")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Oui')[0]
                .click()
        })
        .wait(1000)
        .insert("#edit-montant-cec", values.carrefourMonthlyPendingCredits)
    } else {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-cec")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Non')[0]
                .click()
        })
    }

    if (values.carrefourMonthlyConsommationCredits) {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-cco")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Oui')[0]
                .click()
        })
            .wait(1000)
            .insert("#edit-montant-cco", values.carrefourMonthlyConsommationCredits)
    } else {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-cco")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Non')[0]
                .click()
        })
    }

    if (values.numberOfChildren && values.childCareFees) {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-gar")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Oui')[0]
                .click()
        })
            .wait(1000)
            .insert("#edit-montant-gar", values.childCareFees)
    } else {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-gar")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Non')[0]
                .click()
        })
    }

    if (values.alimonity) {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-ali")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Oui')[0]
                .click()
        })
            .wait(1000)
            .insert("#edit-montant-ali", values.alimonity)
    } else {
        nightmare.evaluate(() => {
            Array.from(document.querySelector(".form-item-ali")
                .querySelectorAll("label"))
                .filter(label => label.innerText === 'Non')[0]
                .click()
        })
    }
    nightmare.evaluate(() => {
        //CLICK CONTINUE
        const actions = document.querySelector(".actions")
        actions.querySelector('a').click()
    })
    .wait(1000)
        .evaluate((values) => {
            const select = document.querySelector(".form-item-type-banque")
            const selectOptions = Array.from(select.querySelectorAll("span"))
            let selectedOption = selectOptions.filter((el) => el.innerText === values.bank)

            if(selectedOption.length === 0 ) {
               selectedOption = selectOptions.filter((el) => el.innerText === "Autre")
            }

            selectedOption[0].click()

        },values)
        .evaluate((values) => {
            Array.from(document.querySelector(".form-item-banque-date-year")
                .querySelectorAll("span"))
                .filter((el) => el.innerText === values.bankAccountYear)[0]
                .click()

        },values)

    if(values.nonReimbursmentLoanRequest) {
        nightmare.click(".form-item-opt label")
    }

    nightmare.wait(1000)
        .evaluate(() => {
            //CLICK CONTINUE
            const actions = document.querySelector(".actions")
            actions.querySelector('a').click()
        })

    // nightmare.end()
    nightmare.then(result => {
        return result
    })
    .catch(error => {
        console.error('Search failed:', error)
    })

    return result
}


initFullFlow()

// initShortFlow()

